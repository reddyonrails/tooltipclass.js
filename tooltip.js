
TooltipClass = {
    initialize: function(dataSource){
        var optionTooltip = {};
        var targetElement = dataSource.targetElement;
        var jsonData = dataSource.jasonData;
        var primaryKey = dataSource.primaryKey;
        var template = dataSource.template;
        optionTooltip.getData = function(){
            $.ajax({
                url: dataSource.url,
                dataType: "json",
                type: "GET",
                processData: false,
                contentType: "application/json",
                success: function(data) {
                    jsonData = data;
                }
            });

        },
        optionTooltip.bindToTargetElement = function(){
            $(targetElement+" option").popover({
                "delay": 0
            });
            _.each($(targetElement).children(),function(option){
                $(option).bind("mouseover",function(){
                   option.setAttribute("data-original-title",optionTooltip.findDataForOption(option.value));
                  $(option).popover("show");
                })
            })


        },
        optionTooltip.findDataForOption = function(key){
            var compiledOutput = "";
            _.each(jsonData,function(item){
                if(eval('item.'+primaryKey) == key){
                    compiledOutput = _.template(template,{item: eval('item.'+dataSource.sourceName)});
                }
            })
            return compiledOutput;
        },
        optionTooltip.toolTipfy = function(){
            if(_.isEmpty(jsonData)){
                    this.getData();
            }
            this.bindToTargetElement();
        }
        return optionTooltip;
    }
}
var dataSourceList = {
    'portfolio': {
        'targetElement': '#analysisjob_portfolio_id',
        'url': '/portfolios',
        'sourceName': 'portfolio',
        'primaryKey': 'portfolio.PortfolioId',
        'jasonData': {},
        'template': "" +
            "<%= item.Name%>" + "<br/>" +
            "<i><%= item.Description%></i>" + "<br/>" +
            ""
     }
}
function loadDataSources(){
    _.each(dataSourceList, function(source){
        var test = TooltipClass.initialize(source);
        test.toolTipfy();
    })
}
dataSourceList.portfolio.jasonData = $.parseJSON('<%= raw @portfolio_items.to_json(:include =>[:portfolio_type]) %>');
 loadDataSources();
