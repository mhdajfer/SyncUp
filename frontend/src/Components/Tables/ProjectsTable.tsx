import { Button } from "@/Components/ui/button";
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
import { Project } from "@/interfaces/Project";
export default function ManagerProjectsTable({
  projectList,
}: {
  projectList: Project[];
}) {
  return (
    <>
      <Table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-lg">
        <TableCaption className="text-lg font-semibold text-gray-700 mb-4">
          Project details
        </TableCaption>
        <TableHeader className="bg-gray-100">
          <TableRow className="text-left text-sm font-semibold uppercase tracking-wide text-gray-700">
            <TableHead className="w-[100px] px-4 py-2 border-b border-gray-200">
              Project name
            </TableHead>
            <TableHead className="px-4 py-2 border-b border-gray-200">
              Client
            </TableHead>
            <TableHead className="px-4 py-2 border-b border-gray-200">
              Status
            </TableHead>
            <TableHead className="px-4 py-2 border-b border-gray-200 text-right">
              Due Date
            </TableHead>
            <TableHead className="px-4 py-2 border-b border-gray-200 text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projectList.map((project, index) => (
            <TableRow
              key={index}
              className={`${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-gray-100 transition-colors duration-150`}
            >
              <TableCell className="px-4 py-2 font-medium text-gray-900 border-b border-gray-200">
                {project.name}
              </TableCell>
              <TableCell className="px-4 py-2 font-medium text-gray-900 border-b border-gray-200">
                {project.description}
              </TableCell>
              <TableCell className="px-4 py-2 font-medium text-gray-900 border-b border-gray-200">
                {project.status}
              </TableCell>
              <TableCell className="px-4 py-2 font-medium text-gray-900 border-b border-gray-200">
                {project.goal}
              </TableCell>
              <TableCell className="px-4 py-2 font-medium text-gray-900 border-b border-gray-200">
                <Button>view Details</Button>
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
    </>
  );
}
