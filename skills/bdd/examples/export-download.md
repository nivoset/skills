# Export / Download

Example: export report, download PDF, CSV export.

Use these as prompts for coverage; rewrite them into domain-specific, observable scenarios before finalizing Gherkin.

## Happy cases

- User exports current data
- User exports filtered data
- User downloads generated file
- File contains expected fields
- File name is correct
- Export respects permissions

## Sad cases

- No data to export
- Export generation fails
- Download link expires
- User lacks permission
- Export takes too long
- File too large

## Edge cases

- Large export async job
- Filtered vs all data
- Time zone formatting
- Currency/number formatting
- Sensitive fields hidden
- CSV escaping
- Multiple downloads
- Browser blocks download

## Research / decision notes

- What format is required?
- Does export include hidden fields?
- Is export synchronous or async?
- Are exports audited?
- How long are files retained?
