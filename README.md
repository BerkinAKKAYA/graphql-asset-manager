## Asset Manager

Example Queries

```graphql
{
	# All Images In The Database
	images

	# Multiple Links
	links(name: "GKM_250", resolutions: [Large, Medium]) {
		res
		name
		address
	}

	# Single Link
	link(name: "GKM_250", resolution: Large)
}
```
