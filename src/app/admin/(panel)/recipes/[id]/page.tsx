"use client";

import { useParams } from "next/navigation";
import { PostForm } from "@/components/admin/post-form";
import { useDemo } from "@/lib/demo-store";

export default function EditRecipePage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useDemo();
  const exists = state.posts.some((post) => post.id === id && post.kind === "recipe");
  if (!exists) return <p>Recipe not found.</p>;
  return <PostForm kind="recipe" postId={id} />;
}
