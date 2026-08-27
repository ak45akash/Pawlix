"use client";

import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { useDemo } from "@/lib/demo-store";

export default function ContentPage() {
  const { state, saveSection } = useDemo();
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Homepage sections</h1>
      <div className="mt-6 space-y-4">
        {state.homepageSections.map((section) => (
          <form
            key={section.id}
            className="space-y-3 rounded-lg border border-border bg-surface p-4"
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              saveSection({
                ...section,
                title: String(data.get("title")),
                body: String(data.get("body")),
                enabled: data.get("enabled") === "on",
              });
            }}
          >
            <Field label="Title">
              <Input name="title" defaultValue={section.title} />
            </Field>
            <Field label="Body">
              <Textarea name="body" defaultValue={section.body} />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="enabled" defaultChecked={section.enabled} /> Enabled
            </label>
            <Button type="submit" size="sm">
              Save section
            </Button>
          </form>
        ))}
      </div>
    </div>
  );
}
