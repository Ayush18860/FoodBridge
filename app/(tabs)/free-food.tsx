import React, { useMemo, useState } from 'react';
import { Text } from 'react-native';
import { Screen } from '@/components/Screen';
import { SearchBar } from '@/components/SearchBar';
import { FilterChips } from '@/components/FilterChips';
import { ListingCard } from '@/components/ListingCard';
import { SectionHeader } from '@/components/SectionHeader';
import { useAppData } from '@/context/AppContext';

const filters = ['All', 'Happening Now', 'Upcoming', 'Gurudwara', 'Temple', 'Iftar', 'NGO'];

export default function FreeFoodScreen() {
  const { listings } = useAppData();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const data = useMemo(() => {
    return listings.filter((item) => {
      if (item.kind === 'cheap-meal') return false;
      const q = search.trim().toLowerCase();
      if (q && ![item.title, item.foodName, item.address].join(' ').toLowerCase().includes(q)) return false;
      if (filter === 'Happening Now' && item.kind === 'event' && !item.isRecurring) return false;
      if (filter === 'Upcoming' && item.kind !== 'event') return false;
      if (filter === 'Gurudwara' && item.eventType !== 'gurudwara') return false;
      if (filter === 'Temple' && item.eventType !== 'temple') return false;
      if (filter === 'Iftar' && item.eventType !== 'iftar') return false;
      if (filter === 'NGO' && item.eventType !== 'ngo') return false;
      return true;
    });
  }, [listings, search, filter]);

  return (
    <Screen>
      <SectionHeader title="Free Food 🤝" subtitle="Live meals, recurring events, and community support" />
      <SearchBar value={search} onChangeText={setSearch} placeholder="Search event, meal, area" />
      <FilterChips options={filters} value={filter} onChange={setFilter} />
      {data.map((item) => <ListingCard key={item.id} item={item} />)}
      {!data.length ? <Text>No free food matches this filter.</Text> : null}
    </Screen>
  );
}
