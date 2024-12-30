"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import * as z from "zod";
import { Button } from "@/Components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/Components/ui/card";
import { toast } from "sonner";
import { createTenant } from "@/api/userService/user";
import { ICreateTenant, User } from "@/interfaces/User";
import { useRouter } from "next/navigation";
import { updateUserDetails } from "@/store/slices/authSlice";
import { useDispatch } from "react-redux";

const addressSchema = z.object({
  country: z
    .string()
    .min(3, "Country must contain at least 3 letters")
    .regex(
      /^[A-Za-z ]+$/,
      "Country must not contain special characters or digits"
    ),
  postal_code: z
    .string()
    .length(6, "Postal code must contain exactly 6 digits")
    .regex(/^[0-9]+$/, "Postal code must contain only digits"),

  state: z
    .string()
    .min(3, "State must contain at least 3 letters")
    .regex(
      /^[A-Za-z ]+$/,
      "State must not contain special characters or digits"
    ),

  street: z
    .string()
    .min(3, "Street must contain at least 3 letters")
    .regex(
      /^[A-Za-z ]+$/,
      "Street must not contain special characters or digits"
    ),
});

const formSchema = z.object({
  company_name: z
    .string()
    .min(3, "Company name must contain at least 3 letters")
    .regex(
      /^[A-Za-z ]+$/,
      "Company name must not contain special characters or digits"
    ),

  company_type: z
    .string()
    .min(3, "Company type must contain at least 3 letters")
    .regex(
      /^[A-Za-z ]+$/,
      "Company type must not contain special characters or digits"
    ),

  address: addressSchema,

  phone_no: z
    .string()
    .length(10, "Phone number must contain exactly 10 digits")
    .regex(/^[0-9]{10}$/, "Phone number must contain exactly 10 digits"),

  domain: z.string().url("Domain must be a valid URL").optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function TenantForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      company_name: "",
      company_type: "",
      address: {
        street: "",
        state: "",
        postal_code: "",
        country: "",
      },
      phone_no: "",
      domain: "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      const tenantData: ICreateTenant = {
        company_name: values.company_name,
        company_type: values.company_type,
        address: values.address,
        phone_no: values.phone_no,
        domain: values.domain,
      };

      const response = await createTenant(tenantData);

      if (response.success) {
        dispatch(updateUserDetails(response.data as User));
        toast.success(response.message);
      } else toast.error(response.message);

      router.push("/admin/tenant");
    } catch (error) {
      console.log("Error while creating new Tenant", error);
      toast.error("Tenant not created:");
    }
  }

  return (
    <div className="space-y-2 py-10 fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm overflow-auto">
      <Card className="relative max-w-2xl mt-36 mx-auto">
        <X
          className=" h-4 w-4 absolute top-1 right-1  hover:text-gray-600 cursor-pointer hover:font-xl"
          onClick={() => router.back()}
        />
        <CardHeader>
          <CardTitle>Tenant Registration</CardTitle>
          <CardDescription>Register a new tenant in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="company_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Inc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="company_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select company type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="llc">LLC</SelectItem>
                            <SelectItem value="corporation">
                              Corporation
                            </SelectItem>
                            <SelectItem value="partnership">
                              Partnership
                            </SelectItem>
                            <SelectItem value="sole_proprietorship">
                              Sole Proprietorship
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone_no"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="domain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Domain (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            placeholder="https://example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="address.street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address.postal_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <CardFooter className="flex justify-end">
                <Button type="submit">Register Tenant</Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
