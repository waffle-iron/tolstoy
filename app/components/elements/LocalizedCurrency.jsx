import React from 'react';
import store from 'store';
// import cc from 'currency-codes';
import { injectIntl } from 'react-intl';
import { getSymbolFromCurrency } from 'currency-symbol-map';
import { FRACTION_DIGITS, DEFAULT_CURRENCY } from 'config/client_config';

let localCurrencySymbol
let localizedCurrency = () => {}

// TODO refactor. This is a mess
// TODO add comments on what this code does
// TODO remove injectIntl, create formatNumber function in Translator
@injectIntl
export default class LocalizedCurrency extends React.Component {

	static propTypes = {
		noSymbol: React.PropTypes.bool,
		fractionDigits: React.PropTypes.number,
		amount: React.PropTypes.number.isRequired
	}

	static defaultProps = {
		noSymbol: false,
		fractionDigits: FRACTION_DIGITS
	}

	state = {
		exchangeRate: store.get('exchangeRate'),
		currency: store.get('currency') || DEFAULT_CURRENCY,
		localCurrencySymbol: getSymbolFromCurrency(store.get('currency') || DEFAULT_CURRENCY)
	}

	// on mount check if data is fresh and fetch it if needed
	componentDidMount() {
		if (process.env.BROWSER) {
			const oneDay = 1000 * 60 * 60 * 24
			const exchangeRateDate = store.get('exchangeRateDate')
			if (!exchangeRateDate || Date.now() - exchangeRateDate > oneDay) {
				this.fetchExchangeRates()
			}
		}
	}

	// TODO move this into redux
	checkIfCurrencyChanged = () => {
		if (process.env.BROWSER) {
			// fetch new exchange data if:
			// currency has changed
			if(this.state.currency != store.get('fetchedCurrency')) this.fetchExchangeRates()
			// if currency rates are not fetched at all
			if (!store.get('exchangeRate')) this.fetchExchangeRates()
		}
	}

	// fetch exchange rates and users country. Store data in localStorage
	fetchExchangeRates = () => {
		console.warn('exchange rates are outdated!')
		console.info('fetching new ones...')
		const {currency} = this.state

		// fetch exchange rates of currently choosen currency
		fetch('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22' + 'USD' + currency + '%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=')
			.then(function(data) { return data.json() })
			.then(data => {
				const exchangeRate = data.query.results.rate.Rate
				store.set('exchangeRate', exchangeRate)
				store.set('exchangeRateDate', Date.now())
				store.set('fetchedCurrency', currency)
				this.setState({
					exchangeRate,
					localCurrencySymbol: getSymbolFromCurrency(currency)
				})
				console.info('Everything is fine, fetched CURRENCY properly')
			})
			.catch(error => {
				console.error('LocalizedCurrency request failed', error)
			})
	}

	render() {
		const {exchangeRate} = this.state
		const {amount, intl: {formatNumber}, noSymbol, fractionDigits, ...rest} = this.props
		let {localCurrencySymbol} = this.state

		this.checkIfCurrencyChanged()

		/**
		 * localyze currency
		 * @param  {number} amount to parse
		 * @param  {object} options
		 * @return {string}
		 */
		// depending on exchange rates data parse local currency or default one
		localizedCurrency = (number, options) => {
			const currencyAmount = 	formatNumber(
										exchangeRate
										? number * exchangeRate
										: number,
										options
									)
			// if noSymbol is specified return only amount of digits
			return 	noSymbol
					? currencyAmount
					: localCurrencySymbol + ' ' + currencyAmount
		}

		return 	<span {...rest}>
					{localizedCurrency(amount, {maximumFractionDigits: fractionDigits})}
				</span>
	}
}

export { localizedCurrency, localCurrencySymbol }
