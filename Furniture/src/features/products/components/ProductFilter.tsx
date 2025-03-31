import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Category } from "@/types";

interface ProductFilterProps {
  filterLists: {
    categories: Category[];
    types: Category[];
  };
}
const FormSchema = z.object({
  categories: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one categories.",
    }),
  types: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one types.",
  }),
});

// categories,

export function ProductFilter({ filterLists }: ProductFilterProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      categories: [],
      types: [],
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="categories"
          render={() => (
            <FormItem>
              <div className="mb-2">
                <FormLabel className="text-base">Furniture made by</FormLabel>
                {/* <FormDescription>
                  Select the items you want to filter.
                </FormDescription> */}
              </div>
              {filterLists.categories.map((category) => (
                <FormField
                  key={category.id}
                  control={form.control}
                  name="categories"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={category.id}
                        className="flex flex-row items-start space-y-0 space-x-3"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(category.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, category.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== category.id,
                                    ),
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {category.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="types"
          render={() => (
            <FormItem>
              <div className="mb-2">
                <FormLabel className="text-base">Furniture types</FormLabel>
                {/* <FormDescription>
                  Select the items you want to filter.
                </FormDescription> */}
              </div>
              {filterLists.types.map((type) => (
                <FormField
                  key={type.id}
                  control={form.control}
                  name="types"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={type.id}
                        className="flex flex-row items-start space-y-0 space-x-3"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(type.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, type.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== type.id,
                                    ),
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {type.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mb-3 cursor-pointer lg:mb-0">
          Filter
        </Button>
      </form>
    </Form>
  );
}
