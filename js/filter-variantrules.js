"use strict";

class PageFilterVariantRules extends PageFilter {
	// region static
	// endregion

	constructor () {
		super();

		this._sourceFilter = new SourceFilter();
		this._ruleTypeFilter = new Filter({header: "Rule Type"});
		this._miscFilter = new Filter({header: "Miscellaneous", items: ["SRD"], isSrdFilter: true});
	}

	mutateForFilters (rule) {
		rule._fMisc = rule.srd ? ["SRD"] : [];
	}

	addToFilters (rule, isExcluded) {
		if (isExcluded) return;

		this._sourceFilter.addItem(rule.source);
		if (rule.type) this._ruleTypeFilter.addItem(rule.type);
	}

	async _pPopulateBoxOptions (opts) {
		opts.filters = [
			this._sourceFilter,
			this._ruleTypeFilter,
			this._miscFilter,
		];
	}

	toDisplay (values, r) {
		return this._filterBox.toDisplay(
			values,
			r.source,
			r.type,
			r._fMisc,
		)
	}
}
