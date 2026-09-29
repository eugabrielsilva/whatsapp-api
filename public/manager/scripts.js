$(function() {

    let authToken = localStorage.getItem('token');

    if(authToken !== null) {
        post('manager/login', {token: authToken}, (data) => {
            $('#login').addClass('hide');
            $('#manager').removeClass('hide');
            updateInstanceStatus();
        }, (error) => {
            localStorage.removeItem('token');
            alert('Invalid token. Please login again.');
        });
    }

    function get(url, callback = null, errorCallback = null) {
        $.ajax({
            type: 'GET',
            url: url,
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            success: (data) => {
                if(callback) {
                    callback(data)
                }
            },
            error: (error) => {
                console.error(error);
                if(errorCallback) {
                    errorCallback(error)
                }
            },
            contentType: 'application/json',
            dataType: 'json'
        });
    }

    function post(url, data = {}, callback = null, errorCallback = null) {
        $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(data),
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            success: (data) => {
                if(callback) {
                    callback(data)
                }
            },
            error: (error) => {
                console.error(error);
                if(errorCallback) {
                    errorCallback(error)
                }
            },
            contentType: 'application/json',
            dataType: 'json'
        });
    }

    function goToPage(id) {
        $('.page').addClass('hide');
        $(`.page${id}`).removeClass('hide');
    }

    $('.nav-link').on('click', function(e) {
        e.preventDefault();
        goToPage($(this).attr('href'));
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
    });

    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        const password = $('#password').val();

        post('manager/login', {token: password}, (data) => {
            localStorage.setItem('token', password);
            $('#login').addClass('hide');
            $('#manager').removeClass('hide');
            updateInstanceStatus();
        }, (error) => {
            alert('Wrong password. Try again.');
        });
    });

    function updateInstanceStatus() {
        get('info', (data) => {
            const state = data?.data?.state ?? 'DISCONNECTED';
            const isConnected = state === 'CONNECTED';
            const className = isConnected ? 'text-bg-success' : 'text-bg-danger';

            $('#instance-state').text(state).removeClass('text-bg-success text-bg-danger').addClass(className);
            $('#instance-number').text(data?.data?.client?.me?.user ?? 'N/A');
            $('#instance-uptime').text(data?.data?.uptime ?? 'N/A');
            $('#instance-version').text(data?.data?.version ?? 'N/A');
            $('#connection').toggleClass('hide', isConnected);
        }, (error) => {
            $('#instance-state').text('DISCONNECTED').removeClass('text-bg-success').addClass('text-bg-danger');
            $('#instance-number').text('N/A');
            $('#instance-uptime').text('N/A');
            $('#instance-version').text('N/A');
            $('#connection').removeClass('hide');
        });
    }

    setInterval(updateInstanceStatus, 5000);

    $('#btnConnect').on('click', function(e) {
        e.preventDefault();

        get('login', (data) => {
            $('#qr-code').attr('src', data?.data?.base64 ?? '').removeClass('hide');
        }, (error) => {
            alert('Failed to get QR code. Please try again.');
        });
    });

    $('#testMessage').on('submit', function(e) {
        e.preventDefault();
        const number = $('#send-test-number').val().replace(/\D/g, '');
        const message = $('#send-test-message').val();

        post(`send-message/${number}`, {message}, (data) => {
            alert('Message sent successfully.');
            $('#send-test-number').val('');
            $('#send-test-message').val('');
        }, (error) => {
            alert('Failed to send message. Please try again.');
        });
    });

});