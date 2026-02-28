import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import type { ReactNode } from 'react'

export default function MenuModal({
  children,
  triggerName,
}: {
  children: ReactNode
  triggerName: string
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          style={{
            cursor: 'pointer',
            background: 'transparent',
            border: 0,
            color: '#fff',
            font: 'inherit',
          }}
          type="button"
        >
          {triggerName}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>{children}</DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
