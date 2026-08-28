"use client";

import { useParams } from "next/navigation";
import { PostForm } from "@/components/admin/post-form";
import { useDemo } from "@/lib/demo-store";

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useDemo();
  const exists = state.posts.some((post) => post.id === id && post.kind === "blog");
  if (!exists) return <p>Post not found.</p>;
  return <PostForm kind="blog" postId={id} />;
}
