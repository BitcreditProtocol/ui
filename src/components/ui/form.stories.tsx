import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm } from "react-hook-form";

import { Button } from "./button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./form";
import { Input } from "./input";

const meta = {
  title: "Components/Form",
  component: Form,
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

interface ProfileFormValues {
  company: string;
}

export const Default: Story = {
  args: {} as never,
  render: () => {
    const form = useForm<ProfileFormValues>({
      defaultValues: {
        company: "",
      },
    });

    return (
      <div className="w-[420px] rounded-lg border border-divider-50 bg-elevation-50 p-4">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(() => {})}>
            <FormField
              control={form.control}
              name="company"
              rules={{ required: "Company name is required." }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input {...field} label="Company" />
                  </FormControl>
                  <FormDescription>The public company name shown on invoices.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    );
  },
};
