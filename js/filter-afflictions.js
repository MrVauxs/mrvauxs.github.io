"use strict";

class PageFilterAfflictions extends PageFilter {

	static getFilterLevel (level) {
		return isNaN(Number(level)) ? "Varies" : Number(level);
	}

	constructor () {
		super();
		this._typeFilter = new Filter({header: "Type"});
		this._levelFilter = new RangeFilter({header: "Level"});
		this._traitFilter = new TraitsFilter({header: "Traits"});
	}

	mutateForFilters (it) {
		it._fType = it.__prop === "itemcurse" ? "Item Curse" : it.__prop.uppercaseFirst();
		it._fTraits = it.traits.map(t => Parser.getTraitName(t));
		it._fLvl = PageFilterAfflictions.getFilterLevel(it.level);
	}

	addToFilters (it, isExcluded) {
		if (isExcluded) return;

		this._sourceFilter.addItem(it.source);
		this._typeFilter.addItem(it._fType);
		this._levelFilter.addItem(it._fLvl);
		this._traitFilter.addItem(it._fTraits);
	}

	async _pPopulateBoxOptions (opts) {
		opts.filters = [
			this._sourceFilter,
			this._typeFilter,
			this._levelFilter,
			this._traitFilter,
		];
	}

	toDisplay (values, it) {
		return this._filterBox.toDisplay(
			values,
			it.source,
			it._fType,
			it._fLvl,
			it._fTraits,
		)
	}
}
