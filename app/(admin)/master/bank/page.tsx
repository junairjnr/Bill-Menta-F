"use client";

import { useState }          from "react";
import { useRouter }         from "next/navigation";
import { Pencil, Trash2 }   from "lucide-react";
import BackPanel             from "@/app/utilsComponents/BackPanel";
import PageHeader            from "@/app/utilsComponents/PageHeader";
// import DeleteDialog          from "@/app/utilsComponents/DeleteDialog";
import { Button }            from "@/components/ui/button";
import { useBankAccounts, useDeleteBankAccount } from "@/app/hooks/masterHooks/bankHook/useBank";

const TYPE_COLORS: Record<string, string> = {
  current:   "bg-blue-100 text-blue-700",
  savings:   "bg-green-100 text-green-700",
  overdraft: "bg-orange-100 text-orange-700",
};

export default function BankAccountsPage() {
  const router          = useRouter();
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId]   = useState("");
  const [deleteName, setDeleteName] = useState("");

  const { data, isLoading } = useBankAccounts();
  const { mutate: remove, isPending: deleting } = useDeleteBankAccount();

  const accounts = data?.data ?? [];

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteId(id); setDeleteName(name); setOpen(true);
  };

  const handleConfirmDelete = () => {
    remove(deleteId, { onSuccess: () => setOpen(false) });
  };

  if (isLoading) return <BackPanel><div className="flex items-center justify-center h-64"><p className="text-gray-400 text-sm">Loading...</p></div></BackPanel>;

  return (
    <BackPanel>
      <div className="p-6 space-y-6">
        <PageHeader
          title="Bank Accounts"
          description="Manage company bank accounts"
          actionLabel="Add Account"
          onAction={() => router.push("/master/bank/add")}
          btnClassName="px-4 py-2 rounded-md bg-black text-white text-sm hover:bg-gray-800"
        />

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">#</th>
                <th className="text-left px-5 py-3 font-semibold">Account Name</th>
                <th className="text-left px-5 py-3 font-semibold">Bank</th>
                <th className="text-left px-5 py-3 font-semibold">Account No</th>
                <th className="text-left px-5 py-3 font-semibold">IFSC</th>
                <th className="text-left px-5 py-3 font-semibold">Type</th>
                <th className="text-left px-5 py-3 font-semibold">UPI ID</th>
                <th className="text-left px-5 py-3 font-semibold">Default</th>
                <th className="text-right px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.length > 0 ? (
                accounts.map((acc, i) => (
                  <tr
                    key={acc._id}
                    onClick={() => router.push(`/master/bank/${acc._id}`)}
                    className="border-t hover:bg-gray-50 cursor-pointer transition"
                  >
                    <td className="px-5 py-4 text-gray-400">{i + 1}</td>
                    <td className="px-5 py-4 font-medium text-gray-800">{acc.accountName}</td>
                    <td className="px-5 py-4 text-gray-600">{acc.bankName}</td>
                    <td className="px-5 py-4 text-gray-600 font-mono text-xs">{acc.accountNumber}</td>
                    <td className="px-5 py-4 text-gray-500 font-mono text-xs">{acc.ifscCode || "—"}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${TYPE_COLORS[acc.accountType] || "bg-gray-100 text-gray-600"}`}>
                        {acc.accountType}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{acc.upiId || "—"}</td>
                    <td className="px-5 py-4">
                      {acc.isDefault && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Default</span>
                      )}
                    </td>
                    {/* <td className="px-5 py-4 text-right space-x-2">
                      <Button onClick={(e) => { e.stopPropagation(); router.push(`/master/bank/edit/${acc._id}`); }} className="p-2 rounded-md border hover:bg-gray-100">
                        <Pencil size={14} />
                      </Button>
                      <Button onClick={(e) => { e.stopPropagation(); handleDeleteClick(acc._id, acc.accountName); }} disabled={deleting} className="p-2 rounded-md border text-red-500 hover:bg-red-50">
                        <Trash2 size={14} />
                      </Button>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr><td colSpan={9} className="text-center py-10 text-gray-400">No bank accounts added yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* <DeleteDialog open={open} onOpenChange={setOpen} itemName={deleteName} onConfirm={handleConfirmDelete} /> */}
      </div>
    </BackPanel>
  );
}