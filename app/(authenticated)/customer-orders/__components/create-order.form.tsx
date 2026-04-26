"use client";

import { Button } from "@/app/_components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/app/_components/ui/field";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { useGetCustomersDropdownQuery } from "../__hooks/use-get-customers-dropdown.query";
import { useGetBooksDropdownQuery } from "../__hooks/use-get-books-dropdown.query";
import { Plus, Trash } from "lucide-react";
import { CreateCustomerDialog } from "./create-customer-dialog";
import { useCreateOrderForm } from "../__hooks/use-create-order-form";

interface Props {
  form: ReturnType<typeof useCreateOrderForm>;
  isPending?: boolean;
}

type OrderItem = {
  bookId: number;
  quantity: number;
  price: number;
};

export const CreateOrderForm = ({ form, isPending }: Props) => {
  const { data: customersData, refetch: refetchCustomers } = useGetCustomersDropdownQuery();
  const { data: booksData } = useGetBooksDropdownQuery();

  const handleCustomerCreated = async (newCustomerId: number) => {
    await refetchCustomers();
    form.setFieldValue("customerId", newCustomerId);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit(e);
      }}
      className="max-h-[calc(100vh-200px)] overflow-y-auto"
    >
      <FieldGroup>
        <form.Field name="customerId">
          {(field) => {
            const isInvalid = form.state.submissionAttempts > 0 && !field.state.meta.isValid;
            const value =
              field.state.value && field.state.value !== 0 ? field.state.value.toString() : "";
            return (
              <Field>
                <div className="flex justify-between items-center">
                  <FieldLabel>Customer *</FieldLabel>
                  <CreateCustomerDialog onCustomerCreated={handleCustomerCreated} />
                </div>
                <Select value={value} onValueChange={(val) => field.handleChange(Number(val))}>
                  <SelectTrigger aria-invalid={isInvalid}>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customersData?.data.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="orderDate">
          {(field) => {
            const isInvalid = form.state.submissionAttempts > 0 && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel>Order Date *</FieldLabel>
                <Input
                  type="date"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        
        <form.Field name="deadline">
          {(field) => (
            <Field>
              <FieldLabel>Deadline (Opsional)</FieldLabel>
              <Input
                type="date"
                value={field.state.value || ""}
                onChange={(e) => field.handleChange(e.target.value || null)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Kosongkan jika tidak ada deadline khusus
              </p>
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>

        <form.Field name="items">
          {(itemsField) => {
            const isInvalid = form.state.submissionAttempts > 0 && !itemsField.state.meta.isValid;
            const items = (itemsField.state.value as OrderItem[]) ?? [];

            const handleBookChange = (index: number, value: string) => {
              const next = [...items];
              next[index] = { ...next[index], bookId: Number(value) };
              itemsField.handleChange(next);
            };

            const handleQuantityChange = (index: number, value: string) => {
              const next = [...items];
              next[index] = { ...next[index], quantity: Number(value) };
              itemsField.handleChange(next);
            };

            const handlePriceChange = (index: number, value: string) => {
              const next = [...items];
              next[index] = { ...next[index], price: Number(value) };
              itemsField.handleChange(next);
            };

            const addItem = () => {
              itemsField.handleChange([...items, { bookId: 0, quantity: 1, price: 0 }]);
            };

            const removeItem = (index: number) => {
              const next = items.filter((_, i) => i !== index);
              itemsField.handleChange(next);
            };

            return (
              <Field>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Order Items *</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="h-4 w-4 mr-1" /> Add Item
                  </Button>
                </div>

                <div className="space-y-4">
                  {items.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8 border rounded-md">
                      No items added. Click {'"Add Item"'} to add order items.
                    </div>
                  ) : (
                    items.map((item, idx) => (
                      <div key={idx} className="border p-4 rounded-md relative">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => removeItem(idx)}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>

                        <Field>
                          <FieldLabel>Book</FieldLabel>
                          <Select
                            value={item.bookId > 0 ? item.bookId.toString() : ""}
                            onValueChange={(val) => handleBookChange(idx, val)}
                          >
                            <SelectTrigger
                              aria-invalid={form.state.submissionAttempts > 0 && !(item.bookId > 0)}
                            >
                              <SelectValue placeholder="Select book" />
                            </SelectTrigger>
                            <SelectContent>
                              {booksData?.data.map((book) => (
                                <SelectItem key={book.id} value={book.id.toString()}>
                                  {book.code} - {book.displayTitle}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {form.state.submissionAttempts > 0 && !(item.bookId > 0) && (
                            <FieldError errors={[{
                              message: "Pilih buku terlebih dahulu"
                            }]} />
                          )}
                        </Field>

                        <Field>
                          <FieldLabel>Quantity</FieldLabel>
                          <Input
                            type="number"
                            min={1}
                            value={item.quantity || ""}
                            onChange={(e) => handleQuantityChange(idx, e.target.value)}
                            aria-invalid={form.state.submissionAttempts > 0 && !(item.quantity > 0)}
                          />
                          {form.state.submissionAttempts > 0 && !(item.quantity > 0) && (
                            <FieldError errors={[{
                              message: "Jumlah harus lebih besar dari 0"
                            }]} />
                          )}
                        </Field>

                        <Field>
                          <FieldLabel>Price</FieldLabel>
                          <Input
                            type="number"
                            step="0.01"
                            min={0}
                            value={item.price || ""}
                            onChange={(e) => handlePriceChange(idx, e.target.value)}
                            aria-invalid={form.state.submissionAttempts > 0 && !(item.price > 0)}
                          />
                          {form.state.submissionAttempts > 0 && !(item.price > 0) && (
                            <FieldError errors={[{
                              message: "Harga harus lebih besar dari 0"
                            }]} />
                          )}
                        </Field>
                      </div>
                    ))
                  )}
                </div>

                {isInvalid && items.length === 0 && (
                  <FieldError errors={[{
                    message: "Minimal satu item harus ditambahkan"
                  }]} />
                )}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="note">
          {(field) => (
            <Field>
              <FieldLabel>Note</FieldLabel>
              <Textarea
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </Field>
          )}
        </form.Field>

        <Button type="submit" isLoading={isPending}>
          Create Order
        </Button>
      </FieldGroup>
    </form>
  );
};
