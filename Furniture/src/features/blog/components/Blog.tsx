import Container from "@/components/layout/components/Container";
import BlogCard from "./BlogCard";
import { posts } from "@/data/posts";
import { BreadCrumb } from "@/components/layout/components/BreadCrumb";

const Blog = () => {
  return (
    <section className="container mx-auto my-20">
      <Container>
        <BreadCrumb currentPage="Blogs" />
        <h1 className="text-xl font-bold 2xl:text-2xl">Latest Blog Posts</h1>
        <BlogCard posts={posts} />
      </Container>
    </section>
  );
};

export default Blog;
