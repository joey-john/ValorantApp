import React, { Component } from 'react';
import { bind_data, bind_detail } from '../Data/bind_data.js';
import { haven_data, haven_detail } from '../Data/haven_data.js';
import { split_data, split_detail } from '../Data/split_data.js';
import { ascent_data, ascent_detail } from '../Data/ascent_data.js';
import { logs_data} from '../Data/logs_data.js';
const AppContext = React.createContext();

class AppProvider extends Component {
	state = {
		lineups: [],
		detailLineup: {},
		currentMap: 'Bind',
		selectedFilters: {
			easy: false,
			medium: false,
			hard: false
		},
		isEssential: false,
		selectedSide: {
			defending: false,
			attacking: false
		},
		selectedType: {
			recon: false,
			shock: false,
		},
		selectedSite: {
			Asite: false,
			Bsite: false,
			Csite: false,
			mid: false
		},
		prevTitle: "",
		prevInfo: "",
		loading: true,
		newDetail: 0,
		logs: logs_data,
		sideLineupsOpen: false
	};

	//updates the map, takes the map name as a parameter and loads the correct data
	updateMap = (map, direct) => {

		let tempLineups = [];
        let data_points = this.getCurrentMap();
		data_points.forEach((item) => {
			item.isActive = false;
			tempLineups.push(item);
		});
		tempLineups[direct].isActive = true;
		let setStateMap = '';
		let setStateDetail;
		if (map === 'bind') {
			setStateMap = 'Bind';
			setStateDetail = bind_detail;
		}
		if (map === 'haven') {
			setStateMap = 'Haven';
			setStateDetail = haven_detail;
		}
		if (map === 'split') {
			setStateMap = 'Split';
			setStateDetail = split_detail;
		}
		if (map === 'ascent') {
			setStateMap = 'Ascent';
			setStateDetail = ascent_detail;
		}
		if(direct !== 0) {
			setStateDetail = tempLineups[direct]
		}
		
		this.setState(() => {
			return {
				lineups: tempLineups,
				currentMap: setStateMap,
				detailLineup: setStateDetail,
				selectedFilters: {
					easy: false,
					medium: false,
					hard: false
				},
				isEssential: false,
				selectedSide: {
					defending: false,
					attacking: false
				},
				selectedType: {
					recon: false,
					shock: false,
				},
				selectedSite: {
					Asite: false,
					Bsite: false,
					mid: false
				},
				newDetail: 0
			};
		});
	};
	setLogs = () => {
		let tempLogs = [];
		logs_data.forEach((item) => {
			tempLogs.push(item)
		})
		this.setState(() => {
			return{
				logs: tempLogs
			}
		})

	}
	setDetailLineup = (id) => {
		const lineup = this.getLineup(id);
	
		let tempLineups = [];
		this.state.lineups.forEach((item) => {
			if (item.id === id) {
				item.isActive = true;
			} else {
				item.isActive = false;
			}
			tempLineups.push(item);
		});
		this.setState(() => {
			return {
				lineups: tempLineups,
				detailLineup: lineup,
				prevTitle: this.state.detailLineup.title,
				prevInfo: this.state.detailLineup.info,
				loading: true,
				sideLineupsOpen: false
			};
		});
	};
	// Toggles filters, takes easy, medium, hard, essential, attacking, defending as parameters
	toggleFilter = (filter) => {
		const itemFilters = ['', false, ''];
		var tempStateFilters = {};
		let tempStateFiltersValues;
		let tempStateFiltersBool;


		let setFilter;
		let item_filter;
		let stateFilters = {};
		let stateEssential;
		let stateSelectedSide = {};

		tempStateFilters = {
			selectedFilters: {
				easy: false,
				medium: false,
				hard: false
			},
			isEssential: false,
			selectedSide: {
				defending: false,
				attacking: false
			},
			selectedType: {
				recon: false,
				shock: false,
			},
			selectedSite: {
				Asite: false,
				Bsite: false,
				Csite: false,
				mid: false
			},
		}

		// selectedFilters (Easy, Medium, Hard)
		switch (filter) {
			case 'easy':
				if (!this.state.selectedFilters.easy) {
					tempStateFilters.stateFilters = {
						easy: true,
						medium: false,
						hard: false
					};
					itemFilters[0] = 'Easy';
				} 	
				break;
			case 'medium':
				if (!this.state.selectedFilters.medium) {
					tempStateFilters.stateFilters = {
						easy: false,
						medium: true,
						hard: false
					};
					itemFilters[0] = 'Medium';
				} 
				break;
			case 'hard':
				if (!this.state.selectedFilters.hard) {
					tempStateFilters.stateFilters = {
						easy: false,
						medium: false,
						hard: true
					};
					itemFilters[0] = 'Hard';
				} 
				break;
		}

		// if (filter === 'easy') {
		// 	setFilter = this.state.selectedFilters.easy;
		// 	item_filter = 'Easy';
		// 	tempStateFilters.stateFilters = {
		// 		easy: true,
		// 		medium: false,
		// 		hard: false
		// 	};
		// } else if (filter === 'medium') {
		// 	setFilter = this.state.selectedFilters.medium;
		// 	item_filter = 'Medium';
		// 	tempStateFilters.stateFilters = {
		// 		easy: false,
		// 		medium: true,
		// 		hard: false
		// 	};
		// } else if (filter === 'hard') {
		// 	setFilter = this.state.selectedFilters.hard;
		// 	item_filter = 'Hard';
		// 	tempStateFilters.stateFilters = {
		// 		easy: false,
		// 		medium: false,
		// 		hard: true
		// 	};
		// } 


		if (filter === 'essential') {
			if (!this.state.isEssential) {
				itemFilters[1] = true;
			}
			tempStateFilters.isEssential = true;
		}

		
		if (filter === 'attacking') {
			if (!this.state.selectedSide.attacking) {
				tempStateFilters.selectedSide = {
					attacking: true,
					defending: false
				};
				itemFilters[2] = 'Attacking';
			}
		}
		else if (filter === 'defending') {
			if (!this.state.selectedSide.defending) {
				tempStateFilters.selectedSide = {
					attacking: false,
					defending: true
				};
				itemFilters[2] = 'Defending';
			}
		}

		tempStateFiltersValues = Object.values(tempStateFilters);
		tempStateFiltersBool = itemFilters.some(x => x);

		console.log(tempStateFilters);
		console.log("ItemFilters: " + itemFilters);
		console.log("TempStateFiltersBool" + tempStateFiltersBool)
		// The Worlds Ugliest Code
		if (tempStateFiltersBool) {
			// const tempLineups = [];
			
			const tempLineups = [];

			let data_points = this.getCurrentMap();
			data_points.forEach((item) => {
				item.isActive = false;
			
				if (itemFilters[0]) {
					if (itemFilters[1]) {
						if (itemFilters[2]) {			// [T, T, T]
							if ((item.difficulty === itemFilters[0]) && (item.essential === true) && (item.side === itemFilters[2])) {
								tempLineups.push(item);
							}
						} 
						else {							// [T, T, F]
							if ((item.difficulty === itemFilters[0]) && (item.essential === true)) {
								tempLineups.push(item);
							}
						}
					} 
					else {								
						if (itemFilters[2]) {			// [T, F, T]
							if ((item.difficulty === itemFilters[0]) && (item.side === itemFilters[2])) {
								tempLineups.push(item);
							}
						} 
						else {							// [T, F, F]
							if ((item.difficulty === itemFilters[0])) {
								tempLineups.push(item);
							}
						}
					}
				}
				else {
					if (itemFilters[1]) {				
						if (itemFilters[2]) {			// [F, T, T]
							if ((item.essential === true) && (item.side === itemFilters[2])) {
								tempLineups.push(item);
							}
						} 
						else {							// [F, T, F]
							if ((item.essential === true)) {
								tempLineups.push(item);
							}
						}
					} 
					else {
						if (itemFilters[2]) {			// [F, F, T]
							if ((item.side === itemFilters[2])) {
								tempLineups.push(item);
							}
						} 
						else {							// [F, F, F]
							// nothing
						}
					}

				}
			});

			console.log("TempLineups");
			console.log(tempLineups);

			tempLineups[0].isActive = true;
			this.setState(() => {
				return {
					lineups: tempLineups,
					selectedFilters: tempStateFilters.stateFilters,
					isEssential: tempStateFilters.isEssential,
					detailLineup: tempLineups[0],
					selectedSide: tempStateFilters.selectedSide
				};
			});
		}
		else {
			this.resetPage();
		}
	};
	resetPage = () => {
		if (this.state.currentMap === 'Bind' || window.location.pathname.includes('bind')) {
			this.updateMap('bind', 0);
		} else if (this.state.currentMap === 'Haven' || window.location.pathname.includes('haven')) {
			this.updateMap('haven', 0);
		} else if (this.state.currentMap === 'Split' || window.location.pathname.includes('split')) {
			this.updateMap('split', 0);
		}
	};
	hideSpinner = () => {
        this.setState({
          loading: false
		});

      };
	setDirectDetail = (num) => {
		this.setState({
			newDetail: num
		})
	}
	lineupsToggleClickHandler = () => {
		this.setState(prevState => {
			return{ 
				sideLineupsOpen: !prevState.sideLineupsOpen
			}
		})
	}
	backdropClickHandler = () => {
		this.setState({
			sideLineupsOpen: false
		})
	}


	//functions needed only inside context.js

	//gets the current map name based off of state, or the path title. state doesn't get updated on a link change when you might need the new map
	//so that's why we also check the location. might break if there's bad path management, but there should never be 2 different maps in a single path
	getCurrentMap = () => {
		let data_points;
		if (window.location.pathname.includes('bind')) {
			data_points = bind_data;
		} else if (window.location.pathname.includes('haven')) {
			data_points = haven_data;
		} else if ( window.location.pathname.includes('split')) {
			data_points = split_data;
		}else if ( window.location.pathname.includes('ascent')) {
			data_points = ascent_data;
		}
		return data_points;
	};
	getLineup = (id) => {
		const lineup = this.state.lineups.find((item) => item.id === id);
		return lineup;
	};

	
	render() {

		return (
			<AppContext.Provider
				value={{
					...this.state,
					setDetailLineup: this.setDetailLineup,
					updateMap: this.updateMap,
					toggleFilter: this.toggleFilter,
					resetPage: this.resetPage,
					hideSpinner: this.hideSpinner,
					setDirectDetail: this.setDirectDetail,
					setLogs: this.setLogs,
					lineupsToggleClickHandler: this.lineupsToggleClickHandler,
					backdropClickHandler: this.backdropClickHandler
				}}y
			>
				{this.props.children}
			</AppContext.Provider>
		);
	}
}

const AppConsumer = AppContext.Consumer;
export { AppProvider, AppConsumer, AppContext };