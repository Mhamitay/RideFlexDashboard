import { FC } from 'react'
import { RecentBooking } from '../api'

declare const BookingList: FC<{ bookings: RecentBooking[]; loading?: boolean }>
export default BookingList
