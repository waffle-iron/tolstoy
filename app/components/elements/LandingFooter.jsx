import React from 'react'
import { PRIVACY_POLICY_URL, TERMS_OF_SERVICE_URL } from 'config/client_config'

export default class LandingFooter extends React.Component {

	render() {
		const menuHeaders = ['Используем Голос', 'Правовые документы', 'Сообщества']
		const columnsAlign = ['left', 'left', 'right']
		const menuItems = [
			[
				{name: 'Приложение', url: 'https://golos.io/'},
				{name: 'Поиск по блокчейну', url: 'https://golosdb.com/'},
				{name: 'Документация', url: 'https://wiki.golos.io/'},
				{name: 'Github', url: 'https://github.com/goloschain'}
			],
			[
				// {name: 'Условия проведения краудфандинга' },
				{name: 'Политика конфиденциальности', url: PRIVACY_POLICY_URL},
				{name: 'Правила пользования', url: TERMS_OF_SERVICE_URL}
			],
			[
				{name: 'Chat', url: 'https://chat.golos.io/'},
				{name: 'Facebook', url: 'https://www.facebook.com/golosru'},
				{name: 'VK', url: 'https://vk.com/rgolos'},
				{name: 'Twitter', url: 'https://twitter.com/goloschain'},
				{name: 'Bitcointalk', url: 'https://bitcointalk.org/index.php?topic=1624364.0'}
			]
		]

		function renderMenus(align) {
			return menuHeaders.map((header, index) => {
				return  <div key={index} className={`small-12 medium-4 columns text-${columnsAlign[index]}`}>
							<strong>{header}</strong>
							<ul>
								{
									menuItems[index].map((item, i) => {
										return  <li key={i}>
													<a href={item.url} target="blank">{item.name}</a>
												</li>
									})
								}
							</ul>
						</div>
			})
		}

		return (
			<section className="LandingFooter">
				<div className="row LandingFooter__menus" id="footer">
					{renderMenus()}
				</div>
				<div className="row text-left LandingFooter__description">
					<div className="small-12 medium-12 columns">
						<span className="text-left">2016 Golos.io</span>
						<span className="text-right" style={{ float: 'right' }}>Децентрализованная социальная сеть для блоггеров и журналистов</span>
					</div>
				</div>
			</section>
		)
	}
}
