"use client";

import { Button } from "@/app/_components/ui/button";
import { FieldError, FieldLabel } from "@/app/_components/ui/field";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { Plus, Trash2, Package, ShoppingCart, FileText, User } from "lucide-react";
import { TSupplier } from "@/types/database";

interface Props {
  // esl
  form: ReturnType<typeof import("@tanstack/react-form").useForm<any>>;
  suppliers: TSupplier[];
  books: { id: number; displayTitle: string }[];
  isPending?: boolean;
  isEdit?: boolean;
}

export const CreateOrUpdatePurchaseOrderForm = ({
  form,
  suppliers,
  books,
  isPending,
  isEdit = false,
}: Props) => {
  return (
    /*
     * Strategi layout:
     * - Form pakai negative margin (-mx-6 -mb-6) untuk keluar dari padding <Page>
     *   dan border-top sebagai pemisah visual dari header di atasnya.
     * - Sesuaikan -mx-6 / -mb-6 dengan padding aktual <Page> Anda.
     *   Contoh: jika <Page> pakai px-8 pb-8, ubah ke -mx-8 -mb-8.
     * - minHeight mengisi sisa layar secara normal flow tanpa fixed/sticky.
     * - Sidebar pakai position sticky + maxHeight yang sama agar tombol
     *   submit selalu terlihat saat scroll konten kanan.
     */
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex border-t border-border -mx-6 -mb-6 mt-6"
      style={{ minHeight: "calc(100vh - 160px)" }}
    >

      {/* ════════════════════════════════════════════════════════════
          SIDEBAR KIRI — info order + submit
      ════════════════════════════════════════════════════════════ */}
      <aside
        className="w-80 shrink-0 flex flex-col border-r border-border bg-background"
        style={{
          position: "sticky",
          top: 0,
          alignSelf: "flex-start",
          maxHeight: "calc(100vh - 160px)",
          overflowY: "auto",
        }}
      >
        {/* Judul sidebar */}
        <div className="px-6 pt-6 pb-5 border-b border-border">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <ShoppingCart className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold leading-tight">
                {isEdit ? "Update Purchase Order" : "Buat Purchase Order"}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isEdit
                  ? "Edit informasi purchase order"
                  : "Pesanan pembelian ke supplier"}
              </p>
            </div>
          </div>
        </div>

        {/* Fields — flex-1 mendorong summary & button ke bawah */}
        <div className="flex flex-col gap-5 px-6 py-5 flex-1">

          {/* Supplier */}
          <form.Field name="supplierId">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              const selectValue =
                field.state.value && field.state.value > 0
                  ? field.state.value.toString()
                  : "";
              return (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <FieldLabel className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Supplier *
                    </FieldLabel>
                  </div>
                  <Select
                    value={selectValue}
                    onValueChange={(v) => field.handleChange(Number(v))}
                  >
                    <SelectTrigger
                      aria-invalid={isInvalid}
                      className={isInvalid ? "border-destructive" : ""}
                    >
                      <SelectValue placeholder="Pilih Supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((s) => (
                        <SelectItem key={s.id} value={s.id.toString()}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isInvalid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </div>
              );
            }}
          </form.Field>

          {/* Tanggal Order */}
          <form.Field name="orderDate">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <div className="space-y-1.5">
                  <FieldLabel className="text-xs font-medium uppercase tracking-wide text-muted-foreground block">
                    Tanggal Order *
                  </FieldLabel>
                  <Input
                    type="date"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    className={isInvalid ? "border-destructive" : ""}
                  />
                  {isInvalid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </div>
              );
            }}
          </form.Field>

          {/* Catatan */}
          <form.Field name="note">
            {(field) => (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <FileText className="h-3 w-3 text-muted-foreground" />
                  <FieldLabel className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Catatan
                  </FieldLabel>
                </div>
                <Textarea
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Catatan tambahan (opsional)..."
                  className="resize-none text-sm min-h-[80px]"
                />
              </div>
            )}
          </form.Field>

          {/* Summary — mt-auto mendorong ke paling bawah area flex */}
          <form.Field name="items">
            {(itemsField) => {
              const validItems = itemsField.state.value.filter(
                (item: any) => item.bookId > 0
              );
              const totalQty = itemsField.state.value.reduce(
                (acc: number, item: any) =>
                  acc + (Number(item.quantity) || 0),
                0
              );
              return (
                <div className="mt-auto pt-4">
                  <div className="rounded-xl border border-border bg-muted/30 divide-y divide-border">
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-xs text-muted-foreground">
                        Total item valid
                      </span>
                      <span className="text-sm font-medium tabular-nums">
                        {validItems.length} item
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-xs text-muted-foreground">
                        Total quantity
                      </span>
                      <span className="text-sm font-medium tabular-nums">
                        {totalQty}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }}
          </form.Field>
        </div>

        {/* Tombol submit — dipaku di bawah sidebar */}
        <div className="px-6 py-5 border-t border-border bg-background">
          <Button
            type="submit"
            className="w-full"
            size="default"
            isLoading={isPending}
          >
            {isPending
              ? "Menyimpan..."
              : isEdit
              ? "Update Purchase Order"
              : "Buat Purchase Order"}
          </Button>
        </div>
      </aside>

      {/* ════════════════════════════════════════════════════════════
          AREA UTAMA — tabel daftar barang
      ════════════════════════════════════════════════════════════ */}
      <main className="flex-1 min-w-0 bg-muted/20 p-8 overflow-y-auto">
        <form.Field name="items">
          {(itemsField) => {
            const isInvalid =
              itemsField.state.meta.isTouched && !itemsField.state.meta.isValid;
            const count = itemsField.state.value.length;

            return (
              <div>
                {/* Header tabel */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-semibold">Daftar Barang</h3>
                    </div>
                    {count > 0 && (
                      <span className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        {count} item
                      </span>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      itemsField.pushValue({ bookId: 0, quantity: 1 })
                    }
                    className="gap-1.5"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Tambah Item
                  </Button>
                </div>

                {/* Tabel */}
                <div className="rounded-xl border border-border bg-background overflow-hidden">
                  {itemsField.state.value.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Belum ada barang
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        Klik "Tambah Item" untuk mulai menambahkan buku
                      </p>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-muted/40">
                          <th className="w-12 px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            #
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Judul Buku
                          </th>
                          <th className="w-36 px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Quantity
                          </th>
                          <th className="w-14 px-4 py-3" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {itemsField.state.value.map(
                          (item: any, index: number) => {
                            const bookSelectValue =
                              item.bookId && item.bookId > 0
                                ? item.bookId.toString()
                                : "";

                            return (
                              <tr
                                key={index}
                                className="group hover:bg-muted/20 transition-colors"
                              >
                                {/* Nomor urut */}
                                <td className="px-4 py-3">
                                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                                    {index + 1}
                                  </span>
                                </td>

                                {/* Select buku */}
                                <td className="px-4 py-3">
                                  <Select
                                    value={bookSelectValue}
                                    onValueChange={(v) => {
                                      const newItems =
                                        itemsField.state.value.map(
                                          (it: any, i: number) =>
                                            i === index
                                              ? { ...it, bookId: Number(v) }
                                              : it
                                        );
                                      itemsField.setValue(newItems);
                                    }}
                                  >
                                    <SelectTrigger className="w-full text-sm">
                                      <SelectValue placeholder="Pilih Buku" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {books.map((b) => (
                                        <SelectItem
                                          key={b.id}
                                          value={b.id.toString()}
                                        >
                                          {b.displayTitle}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </td>

                                {/* Quantity */}
                                <td className="px-4 py-3">
                                  <Input
                                    type="number"
                                    min={1}
                                    value={item.quantity ?? 1}
                                    onChange={(e) => {
                                      const newItems =
                                        itemsField.state.value.map(
                                          (it: any, i: number) =>
                                            i === index
                                              ? {
                                                  ...it,
                                                  quantity: Number(
                                                    e.target.value
                                                  ),
                                                }
                                              : it
                                        );
                                      itemsField.setValue(newItems);
                                    }}
                                    className="w-full text-sm"
                                  />
                                </td>

                                {/* Hapus */}
                                <td className="px-4 py-3">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                                    onClick={() => {
                                      const newItems =
                                        itemsField.state.value.filter(
                                          (_: any, i: number) => i !== index
                                        );
                                      itemsField.setValue(newItems);
                                    }}
                                    disabled={
                                      itemsField.state.value.length === 1
                                    }
                                    title="Hapus item"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>

                      {/* Footer shortcut */}
                      {/* <tfoot>
                        <tr className="border-t border-border bg-muted/20">
                          <td colSpan={4} className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() =>
                                itemsField.pushValue({ bookId: 0, quantity: 1 })
                              }
                              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              Tambah baris baru
                            </button>
                          </td>
                        </tr>
                      </tfoot> */}
                    </table>
                  )}
                </div>

                {isInvalid && (
                  <div className="mt-2">
                    <FieldError errors={itemsField.state.meta.errors} />
                  </div>
                )}
              </div>
            );
          }}
        </form.Field>
      </main>
    </form>
  );
};