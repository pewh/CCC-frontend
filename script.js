var CCC_SETTING = function() {
    var defaultServerName = '0.0.0.0';
    var defaultPort = '8888';

    if ( localStorage ) {
        var prevServerName = localStorage.getItem('ccc-server');
        var prevPort = localStorage.getItem('ccc-port');
        
        return {
            server: prevServerName || defaultServerName,
            port: prevPort || defaultPort
        };
    }

    return {
        server: defaultServerName,
        port: defaultPort
    };
};

var conversation = $('#conversation');

function scrollDown(div) {
    div.animate({ scrollTop: 10000 }, "slow");
}

function sendText(text) {
	var date = new Date();
	var newTime = $('<div class="time"><p>'+ getDate() + '</p></div>');
	newTime.hide();	
	conversation.append(newTime);

	var newText = $('<div class="text sent"><div class="reflect"></div><p>' + text + '</p></div>');
	newText.hide();
	conversation.append(newText);

	newText.show('normal');
	newTime.show('fast');
	scrollDown(conversation);

	$('#imessage').val('');
}

function receiveText(smsText) {
	var date = new Date();
	var newTime = $('<div class="time"><p>'+ getDate() + '</p></div>');
	newTime.hide();	
	conversation.append(newTime);

	var newText = $('<div class="text receive"><div class="reflect" /><p></p></div>');
	newText.hide();
	newText.find('p').append(smsText);
	conversation.append(newText);

	newText.show('normal');
	newTime.show('fast');
	scrollDown(conversation);
}

function getDate() {
    var a_p = "";
	var d = new Date();
	var curr_hour = d.getHours();

	a_p = (curr_hour < 12) ? "AM" : "PM";
	if (curr_hour == 0) curr_hour = 12;
	if (curr_hour > 12) curr_hour = curr_hour - 12;

	var curr_min = d.getMinutes();

	curr_min = curr_min + "";

	if (curr_min.length == 1) curr_min = "0" + curr_min;

    var m_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    var curr_date = d.getDate();
    var curr_month = d.getMonth();
    var curr_year = d.getFullYear();

	return m_names[curr_month] + " " + curr_date + ", " + curr_year + ' '+ curr_hour + ":" + curr_min + " " + a_p;
}

$('p.now')[0].innerText = getDate();

$('#imessage').focus();

$('#clear').click(function(e) {
    e.preventDefault();
    $('#conversation').html('');
    $('#imessage').focus();
});

$('#setting').click(function(e) {
    e.preventDefault();
    var server = prompt('Alamat server?');
    var port = prompt('Port server?');

    if (server && port) {
        localStorage.setItem('ccc-server', server);
        localStorage.setItem('ccc-port', port);
        alert('Setting berhasil diubah');
    } else {
        alert('Setting gagal diubah');
    }
});

$(document.forms[0]).submit(function(e) {
    e.preventDefault();

	var text = $('#imessage').val();

	if (text !== '') {
		sendText(text);

		$.get('http://' + CCC_SETTING().server + ':' + CCC_SETTING().port + '/', { q: text }, function(data) {
            if (data) {
                receiveText(data);

                $('.img-zoomable').magnificPopup({
                    type: 'image',
                    closeOnContentClick: true,
                    closeBtnInside: false,
                    mainClass: 'mfp-no-margins mfp-zoom',
                    zoom: {
                        enabled: true,
                        duration: 300
                    }
                });
            } else {
                receiveText('Aplikasi tidak dapat terhubung ke server');
            }
        });
	}
});
