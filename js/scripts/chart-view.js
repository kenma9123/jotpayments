Date.prototype.getWeek = function(start)
{
    //Calcing the starting point
    start = start || 0;
    var today = new Date(this.setHours(0, 0, 0, 0));
    var day = today.getDay() - start;
    var date = today.getDate() - day;

    // Grabbing Start/End Dates
    var StartDate = new Date(today.setDate(date));
    var EndDate = new Date(today.setDate(date + 6));
    return [StartDate, EndDate];
};

var _jp_ChartView = Backbone.View.extend({

    initialize: function()
    {
        this.currencyTable = [
            ['USD', '$'], ['AUD', 'Australian Dollar'],
            ['BRL', '$'], ['CAD', 'Canadian Dollar'],
            ['CLP', '$'], ['HRK', 'kn'],
            ['CZK', 'Kč'], ['DKK', 'kr'],
            ['EGP', '£'], ['EUR', '€'], ['GHS', '¢'],
            ['HKD', '$'], ['HUF', 'Ft'],
            ['INR', ''], ['IDR', 'Rp'],
            ['ILS', '₪'], ['JPY', '¥'],
            ['MYR', 'RM'], ['MXN', '$'],
            ['TWD', 'NT$'], ['NZD', '$'],
            ['NOK', 'kr'], ['PKR', '₨'],
            ['PHP', '₱'], ['PLN', 'zł'],
            ['GBP', '£'], ['SGD', '$'],
            ['ZAR', 'R'], ['SEK', 'kr'],
            ['CHF', 'CHF'], ['THB', '฿'],
            ['TRY', ''], ['RON', 'lei']
        ];
    },

    getFormattedKey: function(name)
    {
        return String(name).replace(/\s/g,'_');
    },

    /**
     * Sort an array by date
     */
    sortArray: function( a, b )
    {
        a = new Date( a[ 0 ] );
        b = new Date( b [ 0 ] );
        return ( a < b ) ? -1 : ( ( a > b ) ? 1 : 0 );
    },

    formatPrice: function( price, currency )
    {
        var currency_sign = '';
        for( var x = 0; x < this.currencyTable.length; x++ )
        {
            if ( this.currencyTable[x].indexOf(currency) > -1)
            {
                currency_sign = this.currencyTable[x][1];
                break;
            }
        }

        return currency_sign + number_format(price) + ' ' + currency;
    },

    countPaymentProducts: function(payments, next)
    {
        var self = this
          , products_payment_count = {};
        _.each(payments, function(payment, i){
            var products = payment.product;

            _.each(products, function(product, i){

                var product_name = self.getFormattedKey(product.data.name);
                if ( typeof products_payment_count[product_name] === 'undefined' )
                {
                    products_payment_count[product_name] = 0;
                }

                products_payment_count[product_name]++;
            });
        });

        if (next) next.call(this, products_payment_count);
    },

    totalPayments: function(payments)
    {
        var self = this;

        if ( payments )
        {
            //loop through payments
            var total_prices = 0;

            _.each(payments, function(payment, i){
                total_prices += Number(payment.total.replace(',',''));

                //make currency as global
                self.currency = payment.currency;
            });

            window.app.bindings.totalPaymentsViewModel.total_payments(self.formatPrice(total_prices, self.currency));
            window.app.bindings.totalPaymentsViewModel.hasValue( ( payments.length > 0 ) );
        }
    },

    paymentThisWeek: function(payments)
    {
        var self = this
          , payment_on_day = {}
          , days_week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        var thisWeek = new Date().getWeek();

        var getLastSunday = function()
        {   
            return new Date(thisWeek[0]);
        };

        var getNextSunday = function()
        {
            return new Date(thisWeek[1]);
        };

        //loop through payments
        _.each(payments, function(payment, i){
            var products = payment.product;

            //loop throught bought products under payment
            _.each(products, function(product, i){

                //get each product information/data
                var product_created = String(product.created_at)
                  , product_item = product.item
                  , product_data = product.data
                  , product_price = product_data.price;

                var date = moment(product_created).tz(window.app.accountView.user.time_zone).format();
                var payment_day = new Date(date);

                //check if payment date falls within this week only
                if (
                    payment_day.getTime() > getLastSunday().getTime() &&
                    payment_day.getTime() < getNextSunday().getTime()
                )
                {
                    if ( typeof payment_on_day[payment_day.getDay()] === 'undefined' )
                    {
                        payment_on_day[payment_day.getDay()] = 0;
                    }

                    payment_on_day[payment_day.getDay()] += product_price;
                }
            });
        });

        console.log("his week payments", payment_on_day);

        var dayModels = []
          , dayModel = function(data) {
                this.day = ko.observable(data.day);
                this.payment = ko.observable(data.payment);
            }
          , totalPayment = 0;

        for( var z = 0; z < days_week.length; z++ )
        {
            var objectModel = {
                day: days_week[z],
                payment: 0
            };

            if ( typeof payment_on_day[z] !== 'undefined' )
            {
                totalPayment += payment_on_day[z];
                objectModel.payment = self.formatPrice(payment_on_day[z], self.currency);
            }

            dayModels.push(new dayModel(objectModel));
        }

        //push lastlist
        dayModels.push(new dayModel({
            day: "&nbsp;",
            payment: self.formatPrice(totalPayment, self.currency)
        }));

        window.app.bindings.dayWeekViewModel.setDays(dayModels,( payments.length > 0 ));
    },

    bestSeller: function(payments, productSoldcounts)
    {
        var self = this;
        var bestSellerPrice = 0
          , bestSellerCount = _.max(productSoldcounts)
          , bestSellerName = "";

        _.each(productSoldcounts, function(max, key){

            //get the key and loop through the payments to get the total price of the item
            if ( max === bestSellerCount )
            {
                _.each(payments, function(payment, i){
                    //loop through products
                    _.each(payment.product, function(prod, i){
                        //check for the best seller product and add its price
                        if ( prod.data.name === key.replace(/_/g, ' ') )
                        {
                            bestSellerPrice += prod.data.price;
                            bestSellerName = prod.data.name;
                        }
                    });
                });

                return;
            }
        });

        window.app.bindings.bestSellerViewModel.set(bestSellerCount, bestSellerName, self.formatPrice(bestSellerPrice, self.currency), ( payments.length > 0 ));
    },

    productList: function(payments, questions, productSoldcounts)
    {
        console.log(payments, questions);
        var self = this
          , totalSoldCount = 0
          , totalSoldPrice = 0;

        window.app.bindings.productListViewModel.hasValue( ( payments.length > 0 ) );

        if ( payments.length < 1 ) return false;

        //push headers for list
        window.app.bindings.productListViewModel.setHeaders();

        //get the products
        _.each(questions.products, function(product, i){

            var product_name = String(product.name).replace(/\s/g,'_')
              , soldTotal = 0
              , soldCount = 0;

            if ( typeof productSoldcounts[product_name] !== 'undefined' )
            {
                soldCount = productSoldcounts[product_name];
                soldTotal = (product.price * soldCount);

                totalSoldCount += soldCount;
                totalSoldPrice += soldTotal;
            }

            var model = {
                name: product.name,
                price: self.formatPrice(product.price, self.currency),
                soldCount: soldCount,
                soldTotal: self.formatPrice(soldTotal, self.currency)
            };

            window.app.bindings.productListViewModel.setProducts(model);
        });

        //count the total price sold again and total count
        window.app.bindings.productListViewModel.setLast(totalSoldCount, self.formatPrice(totalSoldPrice, self.currency));
    },

    info: function(payments, questions)
    {
        this.totalPayments(payments);
        this.paymentThisWeek(payments);

        //lets count the product solds
        this.countPaymentProducts(payments, function(productSoldcounts){
            this.bestSeller(payments, productSoldcounts);
            this.productList(payments, questions, productSoldcounts);
            this.range(payments, questions, productSoldcounts);

            //hide contentmsg
            if ( payments.length > 0 ) {
                window.app.bindings.contentMsg.hide();
            }
        });
    },

    range: function(payments, questions, productSoldcounts)
    {
        console.log("range payments", payments, questions, productSoldcounts);
        window.app.bindings.chartsViewModel.hasValue(true);

        var self = this
          , chart_data = {};

        _.each(payments, function(val){
            _.each(val.product, function(prod_val){
                var product_data = prod_val.data
                  , product_price = product_data.price
                  , product_date = String(prod_val.created_at).split(' ')[0];

                //add the y(n) to obj depends on how many products
                if ( typeof chart_data[product_date] === 'undefined' )
                {
                    chart_data[product_date] = {};
                }

                var product_name_key = self.getFormattedKey(product_data.name);
                if ( typeof chart_data[product_date][ product_name_key ] === 'undefined' )
                {
                    chart_data[product_date][ product_name_key ] = {
                        price: product_price,
                        count: 0,
                        total: 0
                    };
                }

                chart_data[product_date][ product_name_key ].total += product_price;
                chart_data[product_date][ product_name_key ].count += 1;

                // chart_data[product_date] = array_merge(productSoldcounts, chart_data[product_date]);
            });
        });

        //after getting the products and prices on each date
        //arrange the chart source data
        var zoomingData = []
          , seriesData = [];

        _.each(chart_data, function(val, key){
            var dataKey = ''
              , data = {
                    arg: new Date(key)
                }
              , sData = []
              , x = 1;

              console.log(data);

            //use the product sold count list to generated a (y) data for the chart
            _.each(productSoldcounts, function(prodVal, prodKey){
                //if the product key is undefined set it to zero
                if ( typeof chart_data[key][prodKey] === 'undefined' )
                {
                    chart_data[key][prodKey] = 0;
                }
                var dataField = ('y' + x);
                data[dataField] = ( typeof chart_data[key][prodKey] === 'object' )
                                    ? chart_data[key][prodKey].total : 0;

                sData.push({
                    argumentField: "arg",
                    valueField: dataField,
                    name: prodKey.replace(/_/g, ' ')
                });

                x++;
            }); 

            zoomingData.push(data);
            if ( seriesData.length  < 1 )
            {
                seriesData = sData;
            }
        });
        // chart_data.sort(self.sortArray);
        console.log(chart_data);
        console.log(zoomingData);
        console.log(seriesData);
        // return false;

        // var zoomingData =  [
        //     { arg: 10, y1: -12},
        //     { arg: 20, y1: -32},
        //     { arg: 40, y1: -20},
        //     { arg: 50, y1: -39},
        //     { arg: 60, y1: -10},
        //     { arg: 75, y1: 10},
        //     { arg: 80, y1: 0}
        // ];
        // var series = [{
        //         argumentField: "arg",
        //         valueField: "y1",
        //         name: 'Honda city'
        //     }, {
        //         argumentField: "arg",
        //         valueField: "y2",
        //         name: 'Honda civic'
        //     }, {
        //         argumentField: "arg",
        //         valueField: "y3",
        //         name: 'Toyota Vios'
        //     }];

        var model = {};
        model.chartOptions = {
            argumentAxis: {
                minValueMargin: 0,
                maxValueMargin: 0,
                label: {
                    format: 'shortDate'
                }
            },
            dataSource: zoomingData,
            series: seriesData,
            commonSeriesSettings: {
                type: 'spline'
            },
            tooltip:{
                enabled: true,
                customizeText: function (e) {
                    return self.formatPrice(e.valueText, self.currency) + ' on ' + moment(e.argumentText).format("dddd, MMMM Do");
                }
            },
            legend: {
                visible: true,
                verticalAlignment: "top",
                horizontalAlignment: "center",
                itemTextPosition: 'right'
            }
        };

        model.rangeOptions = {
            size: {
                height: 120
            },
            margin: {
                left: 10
            },
            dataSource: zoomingData,
            chart: {
                series: seriesData
            },
            behavior: {
                callSelectedRangeChanged: "onMoving"
            },
            selectedRangeChanged: function (e) {
                var zoomedChart = $(".range-chart #zoomedChart").dxChart("instance");
                zoomedChart.zoomArgument(e.startValue, e.endValue);
            }
        };

        var html = [
            '<div id="zoomedChart" style="height: 350px"></div>',
            '<div id="selectorChart" style="height: 80px"></div>'
        ].join('');

        window.app.bindings.chartsViewModel.charts(html);

        $(".range-chart #zoomedChart").dxChart(model.chartOptions);
        $(".range-chart #selectorChart").dxRangeSelector(model.rangeOptions);
    }
});