import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


export const eventFormFields = [
  {
    id: 1,
    name: 'title',
    label: 'Event Title',
    placeholder: 'Enter event title',
    type: 'text',
    component: Input,
  },
  {
    id: 2,
    name: 'description',
    label: 'Description',
    placeholder: 'Describe your event...',
    type: 'textarea',
    component: Textarea,
  },
  {
    id: 3,
    name: 'duration',
    label: 'Duration (in minutes)',
    placeholder: 'Event duration',
    type: 'number',
    component: Input,
    min: 1,
    max: 1440, // 24 hours max
  },
  {
    id: 4,
    name: 'isPrivate',
    label: 'Event Privacy',
    type: 'checkbox',
    component: Checkbox,
  },
]


export const bookingFormFields = [
  {
    id: 1,
    name: 'name',
    label: 'Name',
    placeholder: 'Enter name',
    type: 'text',
    component: Input,
  },
  {
    id: 2,
    name: 'email',
    label: 'Email',
    placeholder: 'Enter email',
    type: 'email',
    component: Input,
  },
  {
    id: 3,
    name: 'additionalInfo',
    label: 'Additional Info...',
    placeholder: 'Description',
    type: 'textarea',
    component: Textarea,
  },
]