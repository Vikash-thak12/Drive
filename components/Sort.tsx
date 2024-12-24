"use client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { sortTypes } from "@/constants";
import { usePathname, useRouter } from "next/navigation"


const Sort = () => {
  const path = usePathname();
  const router = useRouter();

  const handleSort = (value: string) => {
    router.push(`${path}?sort=${value}`);
  };


  return (
    <Select onValueChange={handleSort} defaultValue={sortTypes[0].value}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={sortTypes[0].value} />
      </SelectTrigger>
      <SelectContent>
        {
          sortTypes.map((type) => (
            <SelectItem key={type.label} value={type.value}>{type.label}</SelectItem>
          ))
        }
      </SelectContent>
    </Select>

  )
}

export default Sort
