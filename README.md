# Exchange
Node.js utility tool to load stream of orders mimic the behaviour of an exchange where buy & sell orders come, an aggressive matching on price will happen and trades will be printed.

## Prerequisite
- node 14.x >
- order.txt file which contains orders (to be fed with yarn start)

## How to build & run
- `yarn install`
- `yarn build`
- `yarn lint` (optional but good to detect linting issues & fix at development time)
- `yarn test` (to run unit test cases, integration tests are missing but those are out of scope for current timespan)
- To run: `yarn start < order.txt`

## Assumptions
### Functional
- Tool print order book snapshot at the end of consuming the stream, along with trades (if occurred)
- Minimum quantity is 1 and maximum quantity is 999,999,999
- Minimum price is 1 and maximum price is 999,999
- If any invalid input is provided, tool will not throw exception & stop, rather it will ignore the current order and move on to pick next orders and process
- Bids and asks will be sorted based on price, if prices are same then based on arrival time
- If a value is too small to cover the whole reserved area, it should be left padded with spaces _Note: In the requirement document its not padded well_
- Program prints MD5 hash of the order book(quantity, price) for bids & asks (it can be made configurable)


### Technical
- Separated loader and exporter modules from the exchange, as core-exchange's job is to build the book
- Current loader is binded with process.stdin (readline), in future it can be replaced with an API/REST/Graphql
- Exporter only prints values but infuture it can connect with database or external systems to spit the results
- Controller's design is not very clear, at this code its tightly couple with exchange logic but that can be separated with more functionalties. Its built purposely like this. Aim is to bring loader, exporter and exchange into one place via interface first design.
- Added `zod` for input validations, it can be any other library too.
- Using `readline` library from nodejs, because performance is not a concern as mentioned in the requirements. Could load chunks and process too.
- Added `jest` for unit testing
- Added `eslint` for static code analysis
- Sorted bids and asks, _Note: Arrays sorted at the end of each processing, very inconvenient in terms of performance (known problem)_
- Set minimumFractionDigits to 0 while printing orderbook
- Test coverage more than 85, ideally it should be more than 95, but limited test cases due to limited time-span.
- Used command pattern in most of the places but intention was to make as much reusable and loosly-coupled components as possible.

Thank you.