# Ethiopian Date Picker Plugin Documentation

## Overview
The Ethiopian Date Picker is a jQuery plugin designed to integrate an Ethiopian calendar-based date selection interface into an input field. This plugin is highly customizable, allowing developers to adjust the behavior and appearance to fit the needs of their web applications.

## Table of Contents
1. [Initialization](#initialization)
2. [Options](#options)
3. [Methods](#methods)
4. [Events](#events)
5. [Example Usage](#example-usage)
6. [Customization](#customization)
7. [Browser Compatibility](#browser-compatibility)
8. [Dependencies](#dependencies)

## Initialization
To initialize the Ethiopian Date Picker, you simply call the `ethiopianDatePicker` method on a jQuery-wrapped input element. This will attach the date picker functionality to that input field.

### Syntax:
```javascript
$(selector).ethiopianDatePicker(options);
```

- `selector`: The jQuery selector for the input field(s) you want to apply the date picker to.
- `options`: An object containing various settings and customizations for the date picker.

### Example:
```javascript
$('#yourInputField').ethiopianDatePicker({
    dateFormat: 'dd/mm/yyyy',
    closeOnDateSelect: true
});
```

## Options
The plugin supports several options that allow you to customize its behavior:

- **dateFormat** (string): Specifies the format in which the selected date will be displayed in the input field. Common formats include `dd/mm/yyyy`, `mm/dd/yyyy`, etc.

- **closeOnDateSelect** (boolean): If set to `true`, the date picker will automatically close once a date is selected.

- **onSelect** (function): A callback function that is triggered when a date is selected. The function receives the selected date as a parameter.

- **yearRange** (array): An array specifying the range of years available for selection. For example, `[1900, 2100]`.

- **defaultDate** (string): A date in the specified format that will be selected by default when the date picker is first opened.

### Example:
```javascript
$('#yourInputField').ethiopianDatePicker({
    dateFormat: 'dd/mm/yyyy',
    closeOnDateSelect: true,
    yearRange: [2000, 2030],
    defaultDate: '01/01/2020'
});
```

## Methods
The plugin provides methods to control the behavior of the date picker programmatically.

- **open()**: Opens the date picker.
- **close()**: Closes the date picker.
- **setDate(date)**: Sets the selected date programmatically.
- **getDate()**: Returns the currently selected date.

### Example:
```javascript
// Open the date picker
$('#yourInputField').data('ethiopianDatePicker').open();

// Set a specific date
$('#yourInputField').data('ethiopianDatePicker').setDate('01/01/2022');

// Get the selected date
var selectedDate = $('#yourInputField').data('ethiopianDatePicker').getDate();
```

## Events
The Ethiopian Date Picker plugin triggers custom events during its lifecycle, which you can use to add additional behavior to your application.

- **change**: Triggered when the selected date is changed.
- **open**: Triggered when the date picker is opened.
- **close**: Triggered when the date picker is closed.

### Example:
```javascript
$('#yourInputField').on('change', function (event, date) {
    console.log('Date changed to:', date);
});

$('#yourInputField').on('open', function () {
    console.log('Date picker opened');
});

$('#yourInputField').on('close', function () {
    console.log('Date picker closed');
});
```

## Example Usage
Below is a full example that combines all of the options, methods, and events:

```javascript
$(document).ready(function () {
    $('#yourInputField').ethiopianDatePicker({
        dateFormat: 'dd/mm/yyyy',
        closeOnDateSelect: true,
        yearRange: [2000, 2030],
        defaultDate: '01/01/2020',
        onSelect: function (date) {
            alert('You selected: ' + date);
        }
    });

    // Trigger events
    $('#yourInputField').on('change', function (event, date) {
        console.log('Date changed to:', date);
    });

    $('#yourInputField').on('open', function () {
        console.log('Date picker opened');
    });

    $('#yourInputField').on('close', function () {
        console.log('Date picker closed');
    });

    // Programmatic control
    $('#openBtn').click(function () {
        $('#yourInputField').data('ethiopianDatePicker').open();
    });

    $('#setDateBtn').click(function () {
        $('#yourInputField').data('ethiopianDatePicker').setDate('01/01/2022');
    });

    $('#getDateBtn').click(function () {
        var selectedDate = $('#yourInputField').data('ethiopianDatePicker').getDate();
        alert('Selected date: ' + selectedDate);
    });
});
```

## Customization
You can customize the look and feel of the date picker using CSS. The plugin generates the following classes:

- **.ethiopian-datepicker-container**: The main container of the date picker.
- **.calendar-header**: The header section, including navigation buttons and the month/year display.
- **.prev-btn, .next-btn**: The previous and next buttons for navigating between months.
- **.calendar-body**: The body of the calendar where the dates are displayed.
- **.calendar-week-header**: The row containing the days of the week.
- **.calendar-week-day**: Each day of the week.
- **.calendar-day**: Each day in the calendar.
- **.calendar-day.today**: The current date.
- **.calendar-day.empty**: Empty cells in the calendar grid.

### Example CSS:
```css
.ethiopian-datepicker-container {
    border: 1px solid #ddd;
    background-color: #fff;
    font-family: Arial, sans-serif;
    width: 280px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.calendar-header {
    background-color: #f5f5f5;
    padding: 10px;
    text-align: center;
    position: relative;
}

.calendar-header .prev-btn, .calendar-header .next-btn {
    position: absolute;
    top: 10px;
    cursor: pointer;
    color: #007bff;
    font-weight: bold;
}

.calendar-header .prev-btn {
    left: 10px;
}

.calendar-header .next-btn {
    right: 10px;
}

.calendar-week-header {
    background-color: #e9e9e9;
    padding: 5px 0;
    display: flex;
}

.calendar-week-day {
    flex: 1;
    text-align: center;
    font-weight: bold;
}

.calendar-day {
    width: 40px;
    height: 40px;
    display: inline-block;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
}

.calendar-day.today {
    background-color: #007bff;
    color: #fff;
    border-radius: 50%;
}

.calendar-day.empty {
    visibility: hidden;
}
```

## Browser Compatibility
The Ethiopian Date Picker is compatible with all modern web browsers, including:

- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari

The plugin should also work in older versions of these browsers, though testing on specific versions may be necessary.

## Dependencies
The plugin requires the following libraries to function:

- **jQuery**: This plugin is built on jQuery, so you must include jQuery in your project.

```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
```

- **jQuery Calendars Plugin**: The plugin utilizes the jQuery Calendars plugin for handling Ethiopian date calculations. Make sure to include it as well.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.calendars/2.1.0/jquery.calendars.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.calendars/2.1.0/jquery.calendars.ethiopian.min.js"></script>
```

## Conclusion
The Ethiopian Date Picker plugin provides an easy-to-use interface for selecting dates in the Ethiopian calendar format. It is highly customizable, allowing for both functional and stylistic adjustments to suit your application’s needs. With simple integration and comprehensive features, this plugin can enhance the user experience for applications that require Ethiopian date handling.
