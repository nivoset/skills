# Target contract

Provide a reachable `url`, or an explicit `command` plus `url` or `healthUrl`. When both URLs are present, they must share an origin: readiness probes use `healthUrl`, while navigation resolves from `url`. The review storyboard shows both values. `baseUrl` is rejected. The runner never guesses startup commands.
