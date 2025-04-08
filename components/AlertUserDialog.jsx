/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import { cn } from '@/lib/utils'

export function AlertUserDialog({ isOpen, loading, action, description, handleClose }) {
  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent
        className={cn(
          'bg-gradient-to-tr from-white/90 to-blue-50 border border-blue-100 shadow-lg rounded-2xl'
        )}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-blue-600 text-lg font-semibold">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-600">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel
            className="rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 transition"
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={action}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white transition rounded-md"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
