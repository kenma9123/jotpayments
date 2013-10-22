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
        var products_payment_count = {};
        _.each(payments, function(payment, i){
            var products = payment.product;

            _.each(products, function(product, i){

                var product_name = String(product.data.name).replace(/\s/g,'_');
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

        var getLastSunday = function()
        {
            var today = new Date()
              , dif = (today.getDay() + 7) % 7;
            return new Date(today - dif * 24*60*60*1000);
        };

        var getNextSunday = function()
        {
            var today = new Date();
            return new Date(today.getFullYear(),today.getMonth(),today.getDate()+(7-today.getDay()))
        };

        //loop through payments
        _.each(payments, function(payment, i){
            var products = payment.product;

            //loop throught bought products under payment
            _.each(products, function(product, i){

                //get each product information/data
                var product_created = product.created_at
                  , product_item = product.item
                  , product_data = product.data
                  , product_price = product_data.price;

                var date = moment(product_created).tz(window.app.accountView.user.time_zone)._d;
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
            };

        for( var z = 0; z < days_week.length; z++ )
        {
            var objectModel = {
                day: days_week[z],
                payment: 0
            };

            if ( typeof payment_on_day[z] !== 'undefined' )
            {
                objectModel.payment = self.formatPrice(payment_on_day[z], self.currency);
            }

            dayModels.push(new dayModel(objectModel));
        }

        window.app.bindings.dayWeekViewModel.days(dayModels);
        window.app.bindings.dayWeekViewModel.hasValue( ( payments.length > 0 ) )
    },

    bestSeller: function(payments, productSoldcounts)
    {
        var self = this;
        var bestSellerPrice = 0
          , bestSellerName = "";

        _.each(productSoldcounts, function(max, key){

            //get the key and loop through the payments to get the total price of the item
            if ( max === _.max(productSoldcounts) )
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

        window.app.bindings.bestSellerViewModel.price( "with a total of " + self.formatPrice(bestSellerPrice, self.currency) );
        window.app.bindings.bestSellerViewModel.best(bestSellerName);
        window.app.bindings.bestSellerViewModel.hasValue( ( payments.length > 0 ) );
    },

    productList: function(payments, questions, productSoldcounts)
    {
        console.log(payments, questions);
        var self = this;

        var Product = function(data)
        {
            this.name = ko.observable(data.name);
            this.price = ko.observable(data.price);
            this.soldCount = ko.observable(data.soldCount);
            this.soldTotal = ko.observable(data.soldTotal);
        };

        //push headers for list
        window.app.bindings.productListViewModel.products.removeAll();
        window.app.bindings.productListViewModel.products.push(new Product({name:"Name", price:'Price', soldCount:"Count", soldTotal:"Total"}));

        //get the products
        _.each(questions.products, function(product, i){

            var product_name = String(product.name).replace(/\s/g,'_')
              , soldTotal = 0
              , soldCount = 0;

            if ( typeof productSoldcounts[product_name] !== 'undefined' )
            {
                soldCount = productSoldcounts[product_name];
                soldTotal = (product.price * soldCount);
            }

            var model = {
                name: product.name,
                price: self.formatPrice(product.price, self.currency),
                soldCount: soldCount,
                soldTotal: self.formatPrice(soldTotal, self.currency)
            };

            window.app.bindings.productListViewModel.products.push( new Product(model) );
        });

        window.app.bindings.productListViewModel.hasValue( ( payments.length > 0 ) );
    },

    info: function(payments, questions)
    {
        this.totalPayments(payments);
        this.paymentThisWeek(payments);

        //lets count the product solds
        this.countPaymentProducts(payments, function(productSoldcounts){
            this.bestSeller(payments, productSoldcounts);
            this.productList(payments, questions, productSoldcounts);
        });
    },

    pie: function(payment)
    {
        var dataSource = [
            { product: "Honda City", area: 40 },
            { product: "Honda Civic", area: 15 },
            { product: "Toyota Vios", area: 20 },
            { product: "Hyundai Elantra", area: 10 },
        ];

        $(".pie-chart").dxPieChart({
            dataSource: dataSource,
            series: [
                {
                    argumentField: "product",
                    valueField: "area",
                    label: {
                        visible: true,
                        connector: {
                            visible: false,
                            width: 1
                        },
                        position: 'inside'
                    }
                }
            ],
            margin: {
                top:0,
                bottom:0,
                left:0,
                right:0
            },
            tooltip:{
                enabled: true
            },
            legend: {
                visible: true
            },
            title: "Best Sellers"
        });
    },

    range: function()
    {
        var zoomingData =  [
            { arg: 10, y1: -12, y2: 10, y3: 32 },
            { arg: 20, y1: -32, y2: 30, y3: 12 },
            { arg: 40, y1: -20, y2: 20, y3: 30 },
            { arg: 50, y1: -39, y2: 50, y3: 19 },
            { arg: 60, y1: -10, y2: 10, y3: 15 },
            { arg: 75, y1: 10, y2: 10, y3: 15 },
            { arg: 80, y1: 0, y2: 55, y3: 13 },
            { arg: 90, y1: 5, y2: 80, y3: 14 },
            { arg: 100, y1: 50, y2: 90, y3: 90 },
            { arg: 105, y1: 40, y2: 95, y3: 120 },
            { arg: 110, y1: -12, y2: 10, y3: 32 },
            { arg: 120, y1: -32, y2: 30, y3: 12 },
            { arg: 130, y1: -20, y2: 20, y3: 30 },
            { arg: 10, y1: -12, y2: 10, y3: 32 },
            { arg: 20, y1: -32, y2: 30, y3: 12 },
            { arg: 40, y1: -20, y2: 20, y3: 30 },
            { arg: 50, y1: -39, y2: 50, y3: 19 },
            { arg: 60, y1: -10, y2: 10, y3: 15 },
            { arg: 75, y1: 10, y2: 10, y3: 15 },
            { arg: 80, y1: 30, y2: 50, y3: 13 },
            { arg: 90, y1: 40, y2: 50, y3: 14 },
            { arg: 100, y1: 50, y2: 90, y3: 90 },
            { arg: 105, y1: 40, y2: 175, y3: 120 },
            { arg: 110, y1: -12, y2: 10, y3: 32 },
            { arg: 120, y1: -32, y2: 30, y3: 12 },
            { arg: 130, y1: -20, y2: 20, y3: 30 },
            { arg: 140, y1: -12, y2: 10, y3: 32 },
            { arg: 150, y1: -32, y2: 30, y3: 12 },
            { arg: 160, y1: -20, y2: 20, y3: 30 },
            { arg: 170, y1: -39, y2: 50, y3: 19 },
            { arg: 180, y1: -10, y2: 10, y3: 15 },
            { arg: 185, y1: 10, y2: 10, y3: 15 },
            { arg: 190, y1: 30, y2: 100, y3: 13 },
            { arg: 200, y1: 40, y2: 110, y3: 14 },
            { arg: 210, y1: 50, y2: 90, y3: 90 },
            { arg: 220, y1: 40, y2: 95, y3: 120 },
            { arg: 230, y1: -12, y2: 10, y3: 32 },
            { arg: 240, y1: -32, y2: 30, y3: 12 },
            { arg: 255, y1: -20, y2: 20, y3: 30 },
            { arg: 270, y1: -12, y2: 10, y3: 32 },
            { arg: 280, y1: -32, y2: 30, y3: 12 },
            { arg: 290, y1: -20, y2: 20, y3: 30 },
            { arg: 295, y1: -39, y2: 50, y3: 19 },
            { arg: 300, y1: -10, y2: 10, y3: 15 },
            { arg: 310, y1: 10, y2: 10, y3: 15 },
            { arg: 320, y1: 30, y2: 100, y3: 13 },
            { arg: 330, y1: 40, y2: 110, y3: 14 },
            { arg: 340, y1: 50, y2: 90, y3: 90 },
            { arg: 350, y1: 40, y2: 95, y3: 120 },
            { arg: 360, y1: -12, y2: 10, y3: 32 },
            { arg: 367, y1: -32, y2: 30, y3: 12 },
            { arg: 370, y1: -20, y2: 20, y3: 30 },
            { arg: 380, y1: -12, y2: 10, y3: 32 },
            { arg: 390, y1: -32, y2: 30, y3: 12 },
            { arg: 400, y1: -20, y2: 20, y3: 30 },
            { arg: 410, y1: -39, y2: 50, y3: 19 },
            { arg: 420, y1: -10, y2: 10, y3: 15 },
            { arg: 430, y1: 10, y2: 10, y3: 15 },
            { arg: 440, y1: 30, y2: 100, y3: 13 },
            { arg: 450, y1: 40, y2: 110, y3: 14 },
            { arg: 460, y1: 50, y2: 90, y3: 90 },
            { arg: 470, y1: 40, y2: 95, y3: 120 },
            { arg: 480, y1: -12, y2: 10, y3: 32 },
            { arg: 490, y1: -32, y2: 30, y3: 12 },
            { arg: 500, y1: -20, y2: 20, y3: 30 },
            { arg: 510, y1: -12, y2: 10, y3: 32 },
            { arg: 520, y1: -32, y2: 30, y3: 12 },
            { arg: 530, y1: -20, y2: 20, y3: 30 },
            { arg: 540, y1: -39, y2: 50, y3: 19 },
            { arg: 550, y1: -10, y2: 10, y3: 15 },
            { arg: 555, y1: 10, y2: 10, y3: 15 },
            { arg: 560, y1: 30, y2: 100, y3: 13 },
            { arg: 570, y1: 40, y2: 110, y3: 14 },
            { arg: 580, y1: 50, y2: 90, y3: 90 },
            { arg: 590, y1: 40, y2: 95, y3: 12 },
            { arg: 600, y1: -12, y2: 10, y3: 32 },
            { arg: 610, y1: -32, y2: 30, y3: 12 },
            { arg: 620, y1: -20, y2: 20, y3: 30 },
            { arg: 630, y1: -12, y2: 10, y3: 32 },
            { arg: 640, y1: -32, y2: 30, y3: 12 },
            { arg: 650, y1: -20, y2: 20, y3: 30 },
            { arg: 660, y1: -39, y2: 50, y3: 19 },
            { arg: 670, y1: -10, y2: 10, y3: 15 },
            { arg: 680, y1: 10, y2: 10, y3: 15 },
            { arg: 690, y1: 30, y2: 100, y3: 13 },
            { arg: 700, y1: 40, y2: 110, y3: 14 },
            { arg: 710, y1: 50, y2: 90, y3: 90 },
            { arg: 720, y1: 40, y2: 95, y3: 120 },
            { arg: 730, y1: 20, y2: 190, y3: 130 },
            { arg: 740, y1: -32, y2: 30, y3: 12 },
            { arg: 750, y1: -20, y2: 20, y3: 30 },
            { arg: 760, y1: -12, y2: 10, y3: 32 },
            { arg: 770, y1: -32, y2: 30, y3: 12 },
            { arg: 780, y1: -20, y2: 20, y3: 30 },
            { arg: 790, y1: -39, y2: 50, y3: 19 },
            { arg: 800, y1: -10, y2: 10, y3: 15 },
            { arg: 810, y1: 10, y2: 10, y3: 15 },
            { arg: 820, y1: 30, y2: 100, y3: 13 },
            { arg: 830, y1: 40, y2: 110, y3: 14 },
            { arg: 840, y1: 50, y2: 90, y3: 90 },
            { arg: 850, y1: 40, y2: 95, y3: 120 },
            { arg: 860, y1: -12, y2: 10, y3: 32 },
            { arg: 870, y1: -32, y2: 30, y3: 12 },
            { arg: 880, y1: -20, y2: 20, y3: 30 }
        ];
        var series = [{
                argumentField: "arg",
                valueField: "y1",
                name: 'Honda city'
            }, {
                argumentField: "arg",
                valueField: "y2",
                name: 'Honda civic'
            }, {
                argumentField: "arg",
                valueField: "y3",
                name: 'Toyota Vios'
            }];

        var model = {};
        model.chartOptions = {
            argumentAxis: {
               minValueMargin: 0,
               maxValueMargin: 0
            },
            title: "Sales for each product",
            dataSource: zoomingData,
            series: series,
            tooltip:{
                enabled: true
            },
            legend: {
                visible: true,
                verticalAlignment: "top",
                horizontalAlignment: "right"
            },
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
                series: series
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
            '<div id="zoomedChart" data-bind="dxChart: chartOptions" style="height: 350px"></div>',
            '<div data-bind="dxRangeSelector: rangeOptions" style="height: 80px"></div>'
        ].join('');

        $(".range-chart").append(html);
        ko.applyBindings(model, $(".range-chart")[0]);
    }
});