"use client"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { FilterChip } from "@/components/filter-chip"
import { ViewOptionsPopover } from "@/components/view-options-popover"
import { FilterPopover } from "@/components/filter-popover"
import { ChipOverflow } from "@/components/chip-overflow"
import { Link as LinkIcon, Plus, Sparkle } from "@phosphor-icons/react/dist/ssr"
import type { FilterCounts } from "@/lib/data/projects"

interface ProjectHeaderProps {
  filters: { key: string; value: string }[]
  onRemoveFilter: (key: string, value: string) => void
  onFiltersChange: (chips: { key: string; value: string }[]) => void
  counts?: FilterCounts
  viewOptions: {
    viewType: "list" | "board" | "timeline"
    tasks: "indented" | "collapsed" | "flat"
    ordering: "manual" | "alphabetical" | "date"
    showAbsentParent: boolean
    showClosedProjects: boolean
    groupBy: "none" | "status" | "assignee" | "tags"
    properties: string[]
  }
  onViewOptionsChange: (options: any) => void
}

export function ProjectHeader({ filters, onRemoveFilter, onFiltersChange, counts, viewOptions, onViewOptionsChange }: ProjectHeaderProps) {
  return (
    <header className="flex flex-col border-b border-border/40">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="h-8 w-8 rounded-lg hover:bg-accent text-muted-foreground" />
          <p className="text-base font-medium text-foreground">Projects</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Plus className="h-4 w-4" weight="bold" />
            Add Project
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 pb-3 pt-3">
        <div className="flex items-center gap-2">
          <FilterPopover
            initialChips={filters}
            onApply={onFiltersChange}
            onClear={() => onFiltersChange([])}
            counts={counts}
          />
          <ChipOverflow chips={filters} onRemove={onRemoveFilter} maxVisible={6} />
        </div>
        <div className="flex items-center gap-2">
          <ViewOptionsPopover options={viewOptions} onChange={onViewOptionsChange} />
          <div className="relative">
            <div
              className="relative rounded-xl border border-blue-900 shadow-[inset_0_11px_19.3px_0_rgba(0,0,0,0.25)] overflow-hidden"
              style={{
                background: 'conic-gradient(from 0deg at 50% 50%, #FFFFFF 80%, #FFFFFF 0%)',
              }}
            >
              <Button className="h-8 gap-2 rounded-xl bg-gradient-to-r from-blue-900 to-blue-700 text-white hover:from-blue-800 hover:to-blue-600 relative z-10">
                <Sparkle className="h-4 w-4" weight="fill" />
                Ask AI
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
