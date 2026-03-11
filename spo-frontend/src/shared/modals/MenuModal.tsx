import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import type { ReactNode } from 'react'
import styles from './MenuModal.module.css'

export default function MenuModal({
  children,
  triggerName,
  className,
}: {
  children: ReactNode
  triggerName: ReactNode
  className?: string
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className={`${styles.triggerBtn} ${className ?? ''}`}>
          {triggerName}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>{children}</DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
