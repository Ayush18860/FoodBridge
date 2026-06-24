import React, { useMemo, useState } from 'react';
import { Text } from 'react-native';
import { Screen } from '@/components/Screen';
import { SearchBar } from '@/components/SearchBar';
import { FilterChips } from '@/components/FilterChips';
import { ListingCard } from '@/components/ListingCard';
import { SectionHeader } from '@/components/SectionHeader';
import { useAppData } from '@/context/AppContext';

const filters = ['All', 'Under ₹50', 'Veg Only', 'Verified Only'];

export default function MealsScreen() {
  const { listings } = useAppData();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const data = useMemo(() => {
    return listings.filter((item) => {
      if (item.kind === 'event') return false;
      const q = search.trim().toLowerCase();
      if (q && ![item.title, item.foodName, item.address].join(' ').toLowerCase().includes(q)) return false;
      if (filter === 'Under ₹50' && item.price > 50) return false;
      if (filter === 'Veg Only' && !item.isVeg) return false;
      if (filter === 'Verified Only' && !item.verified) return false;
      return true;
    });
  }, [listings, search, filter]);

  return (
    <Screen>
      <SectionHeader title="Cheap Meals & Free Meals" subtitle="Search, filter, and compare quickly" />
      <SearchBar value={search} onChangeText={setSearch} placeholder="Search meals or area" />
      <FilterChips options={filters} value={filter} onChange={setFilter} />
      {data.map((item) => <ListingCard key={item.id} item={item} />)}
      {!data.length ? <Text>No meals match this filter.</Text> : null}
    </Screen>
  );
}
