
$(document).ready(function(){
    $(".btn").click(function(){
        start = $("#startbpm").val();
        end = $("#endbpm").val();

        diff = (end*100/start)-100;
        $(".transfer").html(diff.toFixed(2)+"%");
    });
});
