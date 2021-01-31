"use strict";

class PageFilterHazards extends PageFilter {
	constructor () {
		super();
		this._sourceFilter = new SourceFilter();
		this._levelFilter = new RangeFilter({header: "Level"});
		this._stealthDcFilter = new RangeFilter({header: "Stealth DC"});
		this._stealthMinProfFilter = new Filter({
			header: "Minimum Proficiency",
			itemSortFn: SortUtil.ascSortProfRanks,
			displayFn: it => it.uppercaseFirst(),
		});
		this._stealthFilter = new MultiFilter({
			header: "Stealth",
			filters: [this._stealthDcFilter, this._stealthMinProfFilter],
		});
		this._acFilter = new RangeFilter({header: "Armor Class"});
		this._hardnessFilter = new RangeFilter({header: "Hardness"});
		this._hpFilter = new RangeFilter({header: "Hit Points"});
		this._fortFilter = new RangeFilter({header: "Fortitude"});
		this._refFilter = new RangeFilter({header: "Reflex"});
		this._willFilter = new RangeFilter({header: "Will"});
		this._immunitiesFilter = new Filter({
			header: "Immunities",
			displayFn: StrUtil.toTitleCase,
		});
		this._defenseFilter = new MultiFilter({
			header: "Defenses",
			filters: [this._acFilter, this._hardnessFilter, this._hpFilter],
		});
		this._savingThrowFilter = new MultiFilter({
			header: "Saving Throws",
			filters: [this._fortFilter, this._refFilter],
		});
		this._traitsFilter = new Filter({header: "Traits"});
		this._miscFilter = new Filter({header: "Miscellaneous"});
	}

	mutateForFilters (it) {
		it._fstealth = it.stealth.dc == null ? it.stealth.bonus + 10 : it.stealth.dc;
		if (it.defenses != null) {
			if (it.defenses.ac) it._fac = it.defenses.ac[Object.keys(it.defenses.ac)[0]];
			if (it.defenses.hardness) it._fhardness = it.defenses.hardness[Object.keys(it.defenses.hardness)[0]];
			if (it.defenses.hp) it._fhp = it.defenses.hp[Object.keys(it.defenses.hp)[0]];
			if (it.defenses.saving_throws) it._ffort = it.defenses.saving_throws.fort;
			if (it.defenses.saving_throws) it._fref = it.defenses.saving_throws.ref;
			if (it.defenses.saving_throws) it._fwill = it.defenses.saving_throws.will;
			if (it.defenses.immunities) it._fimmunities = it.defenses.immunities;
		}
		it._ftraits = it.traits.map(t => Parser.getTraitName(t));
		it._fmisc = [];
		if (it.reset) it._fmisc.push("Resettable")
	}

	addToFilters (it, isExcluded) {
		if (isExcluded) return;

		this._sourceFilter.addItem(it.source);
		this._levelFilter.addItem(it.level);
		this._stealthDcFilter.addItem(it._fstealth);
		if (it.stealth.min_prof) this._stealthMinProfFilter.addItem(it.stealth.min_prof);
		if (it._fac != null) this._acFilter.addItem(it._fac);
		if (it._fhardness != null) this._hardnessFilter.addItem(it._fhardness);
		if (it._fhp != null) this._hpFilter.addItem(it._fhp);
		if (it._ffort != null) this._fortFilter.addItem(it._ffort);
		if (it._fref != null) this._refFilter.addItem(it._fref);
		if (it._fwill != null) this._willFilter.addItem(it._fwill);
		if (it._fimmunities != null) this._immunitiesFilter.addItem(it._fimmunities);
		this._traitsFilter.addItem(it._ftraits);
	}

	async _pPopulateBoxOptions (opts) {
		opts.filters = [
			this._sourceFilter,
			this._levelFilter,
			this._traitsFilter,
			this._stealthFilter,
			this._defenseFilter,
			this._immunitiesFilter,
			this._savingThrowFilter,
		];
	}

	toDisplay (values, it) {
		return this._filterBox.toDisplay(
			values,
			it.source,
			it.level,
			it._ftraits,
			[
				it._fstealth,
				it.stealth.min_prof,
			],
			[
				it._fac,
				it._fhardness,
				it._fhp,
			],
			it._fimmunities,
			[
				it._ffort,
				it._fref,
			],
		)
	}
}
