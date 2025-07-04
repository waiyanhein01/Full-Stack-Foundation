import { Request, Response, NextFunction } from "express";
import { query, validationResult } from "express-validator";
import { errorCode } from "../../../config/errorCode";
import { checkUserIfNotExist } from "../../utils/authUtil";
import { authorizeUtil } from "../../utils/authoriseUtil";
import { getUserById, updateUser } from "../../services/authService";
import { checkImageFromMulterSupport } from "../../utils/checkUtil";
import { unlink } from "fs/promises";
import path from "path";
import sharp from "sharp";
import ImageQueue from "../../jobs/queues/imageQueue";
import safeUnlink from "../../utils/safeUnlink";

interface UserIdRequest extends Request {
  userId?: number;
  user?: any;
}

export const changeLanguage = [
  query("lng", "Language code is invalid.")
    .trim()
    .notEmpty()
    .matches("^[a-z]+$")
    .isLength({ min: 2, max: 3 }),
  async (req: UserIdRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      const error: any = new Error(errors[0].msg);
      error.status = 400;
      error.errorCode = errorCode.invalid;
      return next(error);
    }

    const { lng } = req.query;
    res.cookie("i18next", lng);
    res.status(200).json({ message: req.t("changeLan", { lang: lng }) });
  },
];

export const testPermission = async (
  req: UserIdRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const user = await getUserById(userId!);
  checkUserIfNotExist(user);

  const info: any = {
    title: "This is title",
  };

  const authorizeUser = authorizeUtil(true, "AUTHOR", user!.role);

  if (authorizeUser) {
    info.content = "This is content";
  }

  res.status(200).json({
    currentRole: user!.role,
    info,
  });
};

//single profile image
export const profileImageUpload = async (
  req: UserIdRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const user = await getUserById(userId!);
  checkUserIfNotExist(user);

  const image = req.file;
  checkImageFromMulterSupport(image);

  const fileName = image?.filename;

  if (user?.image) {
    try {
      const filePath = path.join(
        __dirname,
        `../../../uploads/images/${user?.image}`
      );
      await unlink(filePath);
    } catch (error) {
      console.log(error);
    }
  }

  const userData = {
    image: fileName,
  };

  await updateUser(userId!, userData);
  res
    .status(200)
    .json({ message: "Upload profile image successfully.", image: fileName });
};

//multiple profile image
export const profileImageUploadMultiple = async (
  req: UserIdRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const user = await getUserById(userId!);
  checkUserIfNotExist(user);

  const images = req.files;
  checkImageFromMulterSupport(images);

  res.status(200).json({ message: "Multiple upload image successfully." });
};

//optimized profile image
export const profileImageOptimizedUpload = async (
  req: UserIdRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const user = await getUserById(userId!);
  checkUserIfNotExist(user);

  const image = req.file;
  checkImageFromMulterSupport(image);

  const splitFileName = req.file?.filename.split(".")[0];

  const job = await ImageQueue.add(
    "optimized-image",
    {
      filePath: req.file?.path,
      fileName: `${splitFileName}.webp`,
      width: 200,
      height: 200,
      quality: 50,
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    }
  );

  // console.log(job);

  // const optimizedImagePath = path.join(
  //   __dirname,
  //   `../../../uploads/images/${fileName}`
  // );

  // try {
  //   await sharp(req.file?.buffer)
  //     .resize(200, 200)
  //     .webp({ quality: 50 })
  //     .toFile(optimizedImagePath);
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).json({ message: "Optimized upload image failed." });
  //   return;
  // }
  if (user?.image) {
    try {
      // console.log("hello");
      const originalFilePath = path.join(
        __dirname,
        "../../..",
        "/uploads/images",
        user!.image
      );

      const optimizedFilePath = path.join(
        __dirname,
        "../../..",
        "/uploads/optimized",
        user.image.split(".")[0] + ".webp"
      );

      await safeUnlink(originalFilePath);
      await safeUnlink(optimizedFilePath);
    } catch (error: any) {
      console.error("Unlink failed:", error.message);
    }
  }

  const userData = {
    image: req.file?.filename,
  };

  await updateUser(userId!, userData);

  res.status(200).json({
    message: "Optimized upload image successfully.Please wait.",
    image: `${splitFileName}.webp`,
    jobId: job.id,
  });
};
