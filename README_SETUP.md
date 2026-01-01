Notes for integration

- This dashboard calls your existing backend; ensure the API is running (e.g. `dotnet run` for RideFlexAPI) and reachable at VITE_API_BASE_URL.
- The dashboard expects the backend `/api/bookings` endpoint to return an array of booking summaries with `id`, `status`, `createdAt`, and optionally `totalAmount`.
