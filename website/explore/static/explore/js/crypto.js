var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var exchange = "Bitfinex";
var watchlist = ['BTC', 'ETH', 'XRP', 'BCH', 'EOS', 'BTG', 'LTC', 'NEO', 'DASH', 'XMR', 'ETC', 'ZEC', 'OMG'];
var socket;

// App
var _window$Recharts = window.Recharts,
    AreaChart = _window$Recharts.AreaChart,
    Area = _window$Recharts.Area,
    ResponsiveContainer = _window$Recharts.ResponsiveContainer;

var Watcher = function Watcher(_ref) {
  var price = _ref.price,
      symbol = _ref.symbol,
      change = _ref.change,
      popupDelay = _ref.popupDelay,
      chartData = _ref.chartData;
  return React.createElement(
    'a',
    { className: 'App__dashboard-watcher ' + (change > 0 ? 'gain' : 'lost'),
      style: {
        animationDelay: popupDelay + 's'
      },
      target: '_blank',
      href: 'https://www.cryptocompare.com/coins/' + symbol.toLowerCase() + '/overview/' + symbol
    },
    React.createElement(
      'div',
      { className: 'chart' },
      React.createElement(
        ResponsiveContainer,
        { width: '100%', height: '100%' },
        React.createElement(
          AreaChart,
          {
            data: chartData
          },
          React.createElement(Area, {
            type: 'monotone',
            dataKey: 'close',
            stroke: change > 0 ? '#63b556' : '#ff6939',
            fill: change > 0 ? '#63b556' : '#ff6939' })
        )
      )
    ),
    React.createElement(
      'h2',
      null,
      symbol
    ),
    React.createElement(
      'h1',
      null,
      '$',
      price
    ),
    React.createElement('span', { className: 'indicator' }),
    React.createElement(
      'span',
      { className: 'change' },
      change,
      '%'
    )
  );
};

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App() {
    var _ref2;

    var _temp, _this, _ret;

    _classCallCheck(this, App);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = App.__proto__ || Object.getPrototypeOf(App)).call.apply(_ref2, [this].concat(args))), _this), _this.state = {
      watcher: watchlist,
      data: {},
      chartData: {},
      socket: 'Off'
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(App, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      socket = io.connect('https://streamer.cryptocompare.com/');
      var subs = this.state.watcher.map(function (symbol) {
        return '2~' + exchange + '~' + symbol + '~USD';
      });
      socket.emit('SubAdd', { subs: subs });
      socket.on("m", this.newChange.bind(this));
      socket.on('connect', function () {
        return _this2.setState({ socket: 'On' });
      });
      socket.on('disconnect', function () {
        return _this2.setState({ socket: 'Off' });
      });

      this.state.watcher.forEach(function (symbol) {
        return _this2.loadChart(symbol);
      });
      setInterval(function () {
        return _this2.state.watcher.forEach(function (symbol) {
          return _this2.loadChart(symbol);
        });
      }, 30000);
    }
  }, {
    key: 'loadChart',
    value: function loadChart(symbol) {
      var _this3 = this;

      fetch('https://min-api.cryptocompare.com/data/histoday?fsym=' + symbol + '&tsym=USD&limit=60&aggregate=3&e=CCCAGG').then(function (res) {
        return res.json();
      }).then(function (data) {
        _this3.setState({
          chartData: Object.assign({}, _this3.state.chartData, _defineProperty({}, symbol, data.Data))
        });
      });
    }
  }, {
    key: 'newChange',
    value: function newChange(message) {
      var data = message.split("~");

      if (data[4] === "1" || data[4] === "2" || data[4] === "4") {
        var fsym = data[2];
        var detail;
        if (typeof this.state.data[fsym] === 'undefined') {
          //first time
          detail = {
            price: data[5],
            volume24: data[10],
            open24: data[12]
          };

          detail.pctChange = ((detail.price - detail.open24) / detail.open24 * 100).toFixed(2);
        } else if (data[4] === "1" || data[4] === "2") {
          detail = Object.assign({}, this.state.data[fsym], {
            price: data[5],
            volume24: data[10]
          });
          detail.pctChange = ((detail.price - detail.open24) / detail.open24 * 100).toFixed(2);
        }

        this.setState({
          data: Object.assign({}, this.state.data, _defineProperty({}, fsym, Object.assign({}, this.state.data[fsym], detail)))
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      return React.createElement(
        'div',
        { className: 'App' },
        React.createElement(
          'div',
          { className: 'App__dashboard' },
          this.state.watcher.map(function (symbol, i) {
            return React.createElement(Watcher, {
              key: symbol,
              symbol: symbol,
              price: _this4.state.data[symbol] ? _this4.state.data[symbol].price : '...',
              change: _this4.state.data[symbol] ? _this4.state.data[symbol].pctChange : '..',
              popupDelay: .55 + i * .2,
              chartData: _this4.state.chartData[symbol]
            });
          })
        ),
        React.createElement(
          'span',
          null,
          'Current Exchange: ',
          exchange
        ),
        React.createElement(
          'span',
          null,
          'Data stream:',
          React.createElement(
            'span',
            {
              style: { color: this.state.socket === 'On' > 0 ? '#ff6939' : '#63b556' } },
            this.state.socket
          )
        ),
        React.createElement(
          'span',
          null,
          'Return Home: ',
          React.createElement(
            'a',
            { href: 'http://127.0.0.1:8000/home/', target: '_blank' },
            'Click Here'
          )
        )
      );
    }
  }]);

  return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('i-am-a-react-app'));