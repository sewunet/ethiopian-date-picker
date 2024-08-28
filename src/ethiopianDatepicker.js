(function ($) {

    /** Implementation of the Ethiopian calendar.
     *  @class EthiopianCalendar
     *  @param {string} [language=''] The language code (default English) for localisation.
     */
    function EthiopianCalendar(language) {
        this.local = this.regionalOptions[language || ''] || this.regionalOptions[''];
    }

    EthiopianCalendar.prototype = new $.calendars.baseCalendar();

    $.extend(EthiopianCalendar.prototype, {
        /** The calendar name. */
        name: 'Ethiopian',
        /** Julian date of start of Ethiopian epoch: 27 August 8 CE (Gregorian). */
        jdEpoch: 1724220.5,
        /** Days per month in a common year. */
        daysPerMonth: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 5],
        /** No year zero. */
        hasYearZero: false,
        /** The minimum month number. */
        minMonth: 1,
        /** The first month in the year. */
        firstMonth: 1,
        /** The minimum day number. */
        minDay: 1,

        /** Localisations for the plugin. */
        regionalOptions: {
            '': {
                name: 'Ethiopian',
                epochs: ['BEE', 'EE'],
                monthNames: ['Meskerem', 'Tikemet', 'Hidar', 'Tahesas', 'Tir', 'Yekatit',
                    'Megabit', 'Miazia', 'Genbot', 'Sene', 'Hamle', 'Nehase', 'Pagume'],
                monthNamesShort: ['Mes', 'Tik', 'Hid', 'Tah', 'Tir', 'Yek',
                    'Meg', 'Mia', 'Gen', 'Sen', 'Ham', 'Neh', 'Pag'],
                dayNames: ['Ehud', 'Segno', 'Maksegno', 'Irob', 'Hamus', 'Arb', 'Kidame'],
                dayNamesShort: ['Ehu', 'Seg', 'Mak', 'Iro', 'Ham', 'Arb', 'Kid'],
                dayNamesMin: ['Eh', 'Se', 'Ma', 'Ir', 'Ha', 'Ar', 'Ki'],
                digits: null,
                dateFormat: 'dd/mm/yyyy',
                firstDay: 0,
                isRTL: false
            }
        },

        /** Determine whether this date is in a leap year. */
        leapYear: function (year) {
            var date = this._validate(year, this.minMonth, this.minDay, $.calendars.local.invalidYear);
            year = date.year() + (date.year() < 0 ? 1 : 0);
            return year % 4 === 3 || year % 4 === -1;
        },

        /** Retrieve the number of months in a year. */
        monthsInYear: function (year) {
            this._validate(year, this.minMonth, this.minDay, $.calendars.local.invalidYear || $.calendars.regionalOptions[''].invalidYear);
            return 13;
        },

        /** Determine the week of the year for a date. */
        weekOfYear: function (year, month, day) {
            var checkDate = this.newDate(year, month, day);
            checkDate.add(-checkDate.dayOfWeek(), 'd');
            return Math.floor((checkDate.dayOfYear() - 1) / 7) + 1;
        },

        /** Retrieve the number of days in a month. */
        daysInMonth: function (year, month) {
            var date = this._validate(year, month, this.minDay, $.calendars.local.invalidMonth);
            return this.daysPerMonth[date.month() - 1] +
                (date.month() === 13 && this.leapYear(date.year()) ? 1 : 0);
        },

        /** Determine whether this date is a week day. */
        weekDay: function (year, month, day) {
            return (this.dayOfWeek(year, month, day) || 7) < 6;
        },

        /** Retrieve the Julian date equivalent for this date. */
        toJD: function (year, month, day) {
            var date = this._validate(year, month, day, $.calendars.local.invalidDate);
            year = date.year();
            if (year < 0) { year++; }
            return date.day() + (date.month() - 1) * 30 +
                (year - 1) * 365 + Math.floor(year / 4) + this.jdEpoch - 1;
        },

        /** Create a new date from a Julian date. */
        fromJD: function (jd) {
            var c = Math.floor(jd) + 0.5 - this.jdEpoch;
            var year = Math.floor((c - Math.floor((c + 366) / 1461)) / 365) + 1;
            if (year <= 0) { year--; }
            c = Math.floor(jd) + 0.5 - this.newDate(year, 1, 1).toJD();
            var month = Math.floor(c / 30) + 1;
            var day = c - (month - 1) * 30 + 1;
            return this.newDate(year, month, day);
        }
    });

    // Ethiopian calendar implementation
    $.calendars.calendars.ethiopian = EthiopianCalendar;

    $.fn.ethiopianDatePicker = function (options) {
        var datePickerPlugin = {
            options: $.extend(
                {
                    dateFormat: 'dd/mm/yyyy',
                    closeOnDateSelect: true,
                    defaultDate: '',
                    minDate: null,
                    maxDate: null,
                    yearStart: null,
                    yearEnd: null
                },
                options
            ),
            init: function ($element) {
                $element.prop('readonly', true);
                var $ethiopianDatePicker = $('<div class="ethiopian-date-picker">');
                $('body').append($ethiopianDatePicker);
                if ($element.val() !== '') {
                    datePickerPlugin.renderFormattedSpecificDateCalendar(
                        $ethiopianDatePicker,
                        datePickerPlugin.options.dateFormat,
                        $element.val()
                    );
                } else {
                    datePickerPlugin.renderCurrentMonthCalendar($ethiopianDatePicker);
                }
                datePickerPlugin.addEventHandler($element, $ethiopianDatePicker);
                datePickerPlugin.addCommonEventHandler($ethiopianDatePicker);
            },
            addCommonEventHandler: function () {
                var $datePickerWrapper = $('.ethiopian-date-picker');
                $(document).click(function (event) {
                    var $targetElement = $(event.target);
                    if (!$targetElement.closest('.ethiopian-date-picker').length) {
                        $datePickerWrapper.hide();
                        $datePickerWrapper.find('.drop-down-content').hide();
                    }
                });
            },
            addEventHandler: function ($element, $ethiopianDatePicker) {
                $element.click(function () {
                    if ($('.ethiopian-date-picker').is(':visible')) {
                        $('.ethiopian-date-picker').hide();
                        return;
                    }

                    var inputFieldPosition = $(this).offset();
                    $ethiopianDatePicker.css({
                        top: inputFieldPosition.top + $(this).outerHeight(true),
                        left: inputFieldPosition.left
                    });

                    if ($element.val()) {
                        datePickerPlugin.renderFormattedSpecificDateCalendar(
                            $ethiopianDatePicker,
                            datePickerPlugin.options.dateFormat,
                            $element.val()
                        );
                    }
                    $ethiopianDatePicker.show();
                    datePickerPlugin.eventFire($element, $ethiopianDatePicker, 'show');

                    return false;
                });

                $ethiopianDatePicker.on('click', '.next-btn', function (event) {
                    event.preventDefault();
                    var preCalendarData = {
                        bsYear: $ethiopianDatePicker.data().bsYear,
                        bsMonth: $ethiopianDatePicker.data().bsMonth,
                        bsDate: $ethiopianDatePicker.data().bsDate
                    };
                    datePickerPlugin.renderNextMonthCalendar($ethiopianDatePicker);
                    datePickerPlugin.triggerChangeEvent($element, $ethiopianDatePicker, preCalendarData);
                    $ethiopianDatePicker.show();

                    return false;
                });

                $ethiopianDatePicker.on('click', '.prev-btn', function (event) {
                    event.preventDefault();
                    var preCalendarData = {
                        bsYear: $ethiopianDatePicker.data().bsYear,
                        bsMonth: $ethiopianDatePicker.data().bsMonth,
                        bsDate: $ethiopianDatePicker.data().bsDate
                    };
                    datePickerPlugin.renderPreviousMonthCalendar($ethiopianDatePicker);
                    datePickerPlugin.triggerChangeEvent($element, $ethiopianDatePicker, preCalendarData);
                    $ethiopianDatePicker.show();

                    return false;
                });

                $ethiopianDatePicker.on('click', '.today-btn', function (event) {
                    event.preventDefault();
                    var preCalendarData = {
                        bsYear: $ethiopianDatePicker.data().bsYear,
                        bsMonth: $ethiopianDatePicker.data().bsMonth,
                        bsDate: $ethiopianDatePicker.data().bsDate
                    };
                    datePickerPlugin.renderCurrentMonthCalendar($ethiopianDatePicker);
                    datePickerPlugin.triggerChangeEvent($element, $ethiopianDatePicker, preCalendarData);
                    $ethiopianDatePicker.show();

                    return false;
                });

                $ethiopianDatePicker.on('click', '.day', function () {
                    var bsDate = $(this).data('bsDate');
                    var bsMonth = $(this).data('bsMonth');
                    var bsYear = $(this).data('bsYear');
                    datePickerPlugin.setElementValue(bsYear, bsMonth, bsDate, $element);
                    $ethiopianDatePicker.hide();
                    datePickerPlugin.eventFire($element, $ethiopianDatePicker, 'dateSelect');
                    if (datePickerPlugin.options.closeOnDateSelect) {
                        $ethiopianDatePicker.hide();
                    }
                });

                $ethiopianDatePicker.on('click', '.drop-down-content .year-list li', function () {
                    var bsYear = $(this).text();
                    var bsMonth = $ethiopianDatePicker.data().bsMonth;
                    var bsDate = $ethiopianDatePicker.data().bsDate;
                    var preCalendarData = {
                        bsYear: $ethiopianDatePicker.data().bsYear,
                        bsMonth: $ethiopianDatePicker.data().bsMonth,
                        bsDate: $ethiopianDatePicker.data().bsDate
                    };
                    datePickerPlugin.renderFormattedSpecificMonthCalendar(
                        $ethiopianDatePicker,
                        bsYear,
                        bsMonth,
                        bsDate
                    );
                    datePickerPlugin.triggerChangeEvent($element, $ethiopianDatePicker, preCalendarData);
                    $ethiopianDatePicker.find('.drop-down-content').hide();
                });

                $ethiopianDatePicker.on('click', '.drop-down-content .month-list li', function () {
                    var bsMonth = $(this).data('month');
                    var bsYear = $ethiopianDatePicker.data().bsYear;
                    var bsDate = $ethiopianDatePicker.data().bsDate;
                    var preCalendarData = {
                        bsYear: $ethiopianDatePicker.data().bsYear,
                        bsMonth: $ethiopianDatePicker.data().bsMonth,
                        bsDate: $ethiopianDatePicker.data().bsDate
                    };
                    datePickerPlugin.renderFormattedSpecificMonthCalendar(
                        $ethiopianDatePicker,
                        bsYear,
                        bsMonth,
                        bsDate
                    );
                    datePickerPlugin.triggerChangeEvent($element, $ethiopianDatePicker, preCalendarData);
                    $ethiopianDatePicker.find('.drop-down-content').hide();
                });

                $ethiopianDatePicker.on('click', '.date-wrapper', function () {
                    var $dropDownContainer = $(this).find('.drop-down-content');
                    if ($dropDownContainer.is(':visible')) {
                        $dropDownContainer.hide();
                        return false;
                    }
                    $('.drop-down-content').hide();
                    $dropDownContainer.show();

                    return false;
                });
            },
            renderPreviousMonthCalendar: function ($calendarElement) {
                var bsYear = $calendarElement.data().bsYear;
                var bsMonth = $calendarElement.data().bsMonth;
                var bsDate = $calendarElement.data().bsDate;
                if (bsMonth - 1 <= 0) {
                    bsYear -= 1;
                    bsMonth = 13;
                } else {
                    bsMonth -= 1;
                }
                datePickerPlugin.renderFormattedSpecificMonthCalendar(
                    $calendarElement,
                    bsYear,
                    bsMonth,
                    bsDate
                );
            },
            renderNextMonthCalendar: function ($calendarElement) {
                var bsYear = $calendarElement.data().bsYear;
                var bsMonth = $calendarElement.data().bsMonth;
                var bsDate = $calendarElement.data().bsDate;
                if (bsMonth + 1 > 13) {
                    bsYear += 1;
                    bsMonth = 1;
                } else {
                    bsMonth += 1;
                }
                datePickerPlugin.renderFormattedSpecificMonthCalendar(
                    $calendarElement,
                    bsYear,
                    bsMonth,
                    bsDate
                );
            },
            renderCurrentMonthCalendar: function ($calendarElement) {
                var todayDate = $.calendars.instance('ethiopian').newDate();
                datePickerPlugin.renderFormattedSpecificMonthCalendar(
                    $calendarElement,
                    todayDate.year(),
                    todayDate.month(),
                    todayDate.day()
                );
            },
            renderFormattedSpecificDateCalendar: function ($calendarElement, dateFormat, formattedDate) {
                var date = $.calendars.instance('ethiopian').parseDate(dateFormat, formattedDate);
                datePickerPlugin.renderFormattedSpecificMonthCalendar(
                    $calendarElement,
                    date.year(),
                    date.month(),
                    date.day()
                );
            },
            renderFormattedSpecificMonthCalendar: function ($calendarElement, bsYear, bsMonth, bsDate) {
                var currentDate = $.calendars.instance('ethiopian').newDate(bsYear, bsMonth, bsDate);
                var bsYear = currentDate.year();
                var bsMonth = currentDate.month();
                var bsDate = currentDate.day();
                var bsDaysInMonth = currentDate.daysInMonth();
                var bsCalendarDates = [];
                var index = 0;
                var weekDay = currentDate.dayOfWeek();
                $calendarElement.data({
                    bsYear: bsYear,
                    bsMonth: bsMonth,
                    bsDate: bsDate
                });

                var todayDate = $.calendars.instance('ethiopian').newDate();
                var todayBsYear = todayDate.year();
                var todayBsMonth = todayDate.month();
                var todayBsDate = todayDate.day();

                while (index < weekDay) {
                    bsCalendarDates.push(null);
                    index += 1;
                }
                for (var bsCurrentDate = 1; bsCurrentDate <= bsDaysInMonth; bsCurrentDate += 1) {
                    var bsCalendarDate = {
                        bsYear: bsYear,
                        bsMonth: bsMonth,
                        bsDate: bsCurrentDate,
                        isToday:
                            todayBsYear === bsYear &&
                            todayBsMonth === bsMonth &&
                            todayBsDate === bsCurrentDate
                    };
                    bsCalendarDates.push(bsCalendarDate);
                }

                datePickerPlugin.renderCalendar($calendarElement, bsCalendarDates);
            },
            setElementValue: function (bsYear, bsMonth, bsDate, $element) {
                var selectedDate = $.calendars.instance('ethiopian').newDate(bsYear, bsMonth, bsDate);
                $element.val(
                    $.calendars.instance('ethiopian').formatDate(
                        datePickerPlugin.options.dateFormat,
                        selectedDate
                    )
                );
            },
            renderCalendar: function ($calendarElement, bsCalendarDates) {
                var currentBsYear = $calendarElement.data().bsYear;
                var currentBsMonth = $calendarElement.data().bsMonth;
                var $calendar = $('<div class="ethiopian-date-picker-calendar">');
                var headerHtml =
                    '<div class="calendar-header">' +
                    '<div class="prev-btn"><<</div>' +
                    '<div class="drop-down-container date-wrapper">' +
                    '<div class="date-title">' +
                    '<span class="month-name">' +
                    $.calendars.instance('ethiopian').regionalOptions[''].monthNames[
                        currentBsMonth - 1
                    ] +
                    '</span>' +
                    ' <span class="year">' +
                    currentBsYear +
                    '</span>' +
                    '</div>' +
                    '<div class="drop-down-content">' +
                    '<ul class="month-list">';
                $.each(
                    $.calendars.instance('ethiopian').regionalOptions[''].monthNames,
                    function (index, month) {
                        headerHtml += '<li data-month="' + (index + 1) + '">' + month + '</li>';
                    }
                );
                headerHtml += '</ul><ul class="year-list">';
                for (var year = 1900; year <= 2100; year += 1) {
                    headerHtml += '<li>' + year + '</li>';
                }
                headerHtml += '</ul></div></div>';
                headerHtml += '<div

                class="next-btn">>></div>' +
                '</div>' +
                '<div class="calendar-body">' +
                '<div class="calendar-week-header">';
            $.each($.calendars.instance('ethiopian').regionalOptions[''].dayNamesMin, function (index, day) {
                headerHtml += '<div class="calendar-week-day">' + day + '</div>';
            });
            headerHtml += '</div><div class="calendar-dates">';

            $.each(bsCalendarDates, function (index, date) {
                if (!date) {
                    headerHtml += '<div class="calendar-day empty"></div>';
                } else {
                    headerHtml +=
                        '<div class="calendar-day' +
                        (date.isToday ? ' today' : '') +
                        '" data-bs-year="' +
                        date.bsYear +
                        '" data-bs-month="' +
                        date.bsMonth +
                        '" data-bs-date="' +
                        date.bsDate +
                        '">' +
                        date.bsDate +
                        '</div>';
                }
            });

            headerHtml += '</div></div>';
            $calendar.html(headerHtml);
            $calendarElement.html($calendar);
        },
        triggerChangeEvent: function ($element, $calendarElement, preCalendarData) {
            var currentBsYear = $calendarElement.data().bsYear;
            var currentBsMonth = $calendarElement.data().bsMonth;
            var currentBsDate = $calendarElement.data().bsDate;
            if (
                preCalendarData.bsYear !== currentBsYear ||
                preCalendarData.bsMonth !== currentBsMonth ||
                preCalendarData.bsDate !== currentBsDate
            ) {
                datePickerPlugin.eventFire($element, $calendarElement, 'change');
            }
        },
        eventFire: function ($element, $calendarElement, eventName) {
            $element.trigger(eventName, {
                bsYear: $calendarElement.data().bsYear,
                bsMonth: $calendarElement.data().bsMonth,
                bsDate: $calendarElement.data().bsDate
            });
        }
    };

    return this.each(function () {
        var $this = $(this);
        if (!$this.data('ethiopianDatePicker')) {
            datePickerPlugin.init($this);
            $this.data('ethiopianDatePicker', datePickerPlugin);
        }
    });
};

})(jQuery);

// Usage example:
// $('#yourInputField').ethiopianDatePicker({
//     dateFormat: 'dd/mm/yyyy',
//     closeOnDateSelect: true
// });

