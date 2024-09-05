# performwithK6
## For instalation K6: 
* On macOS: brew install k6
* On Windows: Use Chocolatey: choco install k6
* On Linux: Use APT: sudo apt install k6

## For running commands K6:
* for running: `k6 run script.js`
* for report: `k6 run --out csv=results.csv script.js`

## About script:

Implemented GET, POST, PUT, DELETE on API https://jsonplaceholder.typicode.com/users
Implemented error handling on GET, when trying to get a user that doesn't exist
Implemented stages with ramp up, stable, ramp down parameters
Implemented thresholds with metrics general http_req_duration, http_req_failed

Could be implemented custom metrics, that will be added to the thresholds, like Counter, Gauge, Trend, Rate
