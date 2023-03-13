## Class Name
CategoryBrowser

## Function
The component takes a list of hierarchical categories via the data source.
It interprets the data into a consistent internal model using the attributes to map the datasource object properties.
You must send in all the hierarchical levels !!

It stores the selected category into the state and stores the search string into the specified Flow value.

The data should contain every possible value including the core level 1 values e.g.
````
[
    {
        "id":"001",
        "lvl1":"Hardware"
    },
    {
        "id":"001-001",
        "lvl1":"Hardware",
        "lvl2":"Nuts & Bolts"
    },
    {
        "id":"001-001-001",
        "lvl1":"Hardware",
        "lvl2":"Nuts & Bolts";
        "lvl3":"Nuts"
    },
    {
        "id":"001-001-002",
        "lvl1":"Hardware",
        "lvl2":"Nuts & Bolts";
        "lvl3":"Bolts"
    }
]
````
## Component Definition
There is a .component file in the project root folder to import into Flow.
It will need re-pointing to your local copy of the .js & .css files.

## Datasource
A list of cayegories to display.

## State
An object of the same type as the datasource to receive the selected category item.

## Label
A title to be displayed at the top of the component.

## Display Columns
We use this to tell the component which object data properties relate to each mapped field.
Set them in the correct order.
- 1: id Column
- 2: lvl1 Category Column
- 3: lvl2 Category Column
- 4: lvl3 Category Column

## Attributes
### idSeparatorCharacter
This tells the component how to split up the id value, provide a string;

### searchStringFieldName
This tells the component the name of the Flow value to store the search input box's value into.

### searchOutcomeName
This tells the component the name of the Flow Outcome to trigger when the user hits the string search button.

### selectOutcomeName
This tells the component the name of the Flow Outcome to trigger when the user selects a category.