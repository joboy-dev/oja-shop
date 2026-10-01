import { Search, X } from "lucide-react"
import Badge from "../Badge"
import Button from "../button/Button"
import TextField from "./TextField"

interface SectionsSearchProps {
  setSearchQuery?: (query: string) => void
  searchQuery?: string
  onSearch?: () => void
  onSearchClear?: () => void
  placeholder?: string
}

export function SearchField({ 
  setSearchQuery, 
  searchQuery, 
  onSearch, 
  onSearchClear, 
  placeholder 
}: SectionsSearchProps) {
//   const [localQuery, setLocalQuery] = useState(searchQuery)

  // const handleSearch = (query: string) => {
  //   // setLocalQuery(query)
  //   // setSearchQuery(query)
  //   // const timeout = setTimeout(() => {
  //   // }, 300)
  //   onSearch()
  //   // return () => clearTimeout(timeout)
  // }

  const clearSearch = () => {
    if (setSearchQuery) {
      setSearchQuery("")
    }
    if (onSearchClear) {
      onSearchClear()
    }
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex gap-4 items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <TextField
            type="text"
            placeholder={placeholder ?? "Search"}
            value={searchQuery ?? ""}
            // onChange={(e) => handleSearch(e.target.value)}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            className="pl-10 border-primary/20 focus:border-primary"
          />
        </div>

        {/* Clear Search */}
        {searchQuery && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              // onClick={() => handleSearch(searchQuery)}
              onClick={onSearch}
              className="border-primary/20 text-muted-foreground hover:bg-muted"
            >
              <Search className="h-4 w-4" />
            </Button>

            <Button
              variant="outlineAccent"
              size="sm"
              onClick={clearSearch}
              className="border-primary/20 text-muted-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Active Search */}
      {searchQuery && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Searching for:</span>
          <Badge variant="primary" className="bg-primary/10 text-primary">
            "{searchQuery}"
          </Badge>
        </div>
      )}
    </div>
  )
}
