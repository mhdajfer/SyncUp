import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";

interface listData {
  invoice: string;
  paymentStatus: string;
  totalAmount: string;
  paymentMethod: string;
}

export default function DataTable({ dataList }: { dataList: listData[] }) {
  return (
    <Table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-lg">
      <TableCaption className="text-lg font-semibold text-gray-700 mb-4">
        A list of your recent invoices.
      </TableCaption>
      <TableHeader className="bg-gray-100">
        <TableRow className="text-left text-sm font-semibold uppercase tracking-wide text-gray-700">
          <TableHead className="w-[100px] px-4 py-2 border-b border-gray-200">
            Invoice
          </TableHead>
          <TableHead className="px-4 py-2 border-b border-gray-200">
            Status
          </TableHead>
          <TableHead className="px-4 py-2 border-b border-gray-200">
            Method
          </TableHead>
          <TableHead className="px-4 py-2 border-b border-gray-200 text-right">
            Amount
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dataList.map((invoice, index) => (
          <TableRow
            key={invoice.invoice}
            className={`${
              index % 2 === 0 ? "bg-gray-50" : "bg-white"
            } hover:bg-gray-100 transition-colors duration-150`}
          >
            <TableCell className="px-4 py-2 font-medium text-gray-900 border-b border-gray-200">
              {invoice.invoice}
            </TableCell>
            <TableCell className="px-4 py-2 text-gray-700 border-b border-gray-200">
              <span
                className={`${
                  invoice.paymentStatus === "Paid"
                    ? "text-green-600"
                    : invoice.paymentStatus === "Pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {invoice.paymentStatus}
              </span>
            </TableCell>
            <TableCell className="px-4 py-2 text-gray-700 border-b border-gray-200">
              {invoice.paymentMethod}
            </TableCell>
            <TableCell className="px-4 py-2 text-right text-gray-900 border-b border-gray-200">
              {invoice.totalAmount}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter className="bg-gray-100">
        <TableRow>
          <TableCell
            colSpan={3}
            className="px-4 py-2 font-semibold text-gray-700 border-b border-gray-200"
          >
            Total
          </TableCell>
          <TableCell className="px-4 py-2 text-right text-gray-900 font-semibold border-b border-gray-200">
            $2,500.00
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
