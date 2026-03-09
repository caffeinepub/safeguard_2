# Specification

## Summary
**Goal:** Update the default emergency contact throughout the SafeGuard app to Aditya Patel (9546530546).

**Planned changes:**
- Update the Settings page pre-populated defaults to show "Aditya Patel" and "9546530546" when no profile is saved
- Update the backend default emergency contact to return "Aditya Patel" and "9546530546" for users who have not customized their contact (without overwriting existing saved contacts)
- Update the Home page to prominently display "Aditya Patel" and "9546530546" with a large CALL NOW button that triggers `tel:9546530546`, with messaging that anyone (girls, boys, or children) in danger can use it to call for help
- Ensure the Emergency Call modal displays "Aditya Patel" and "9546530546" when the default contact is loaded

**User-visible outcome:** Users will see Aditya Patel's name and number (9546530546) as the default emergency contact across the app, and anyone in trouble can tap the CALL NOW button on the Home page to immediately call for help.
