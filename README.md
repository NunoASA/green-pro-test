# GreenPro Tech Test

This project processes a list of customer housing submissions and generates:
- Estimated heat loss
- Power heat loss using weather API data
- Recommended heat pump
- Cost breakdown including VAT
---

### Requirements
- Node.js 22 was used, but should support at least 16+

---

### How to Run

1. **Install dependencies**

```
npm install
```
---

2. **Run the app**

If we want to run with the given sample we can do:
```
npm start
```

If we want to provide a different file we can do it via arguments:
```
npm start -- ./data/houses.json
```
---

3. **Run tests**

```
npm test
```
---

### Project structure

```
src/
  index.ts             # Main script
  utils/               # Helper functions
data/
  houses.json          # Sample housing submissions
  heat-pumps.json      # Available pump packages
```