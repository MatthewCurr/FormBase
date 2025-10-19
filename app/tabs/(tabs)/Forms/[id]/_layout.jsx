import { Tabs } from 'expo-router';

export default function EditTabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="Edit" options={{ title: 'Edit' }} />
      <Tabs.Screen name="Map" options={{ title: 'Map' }} />
      <Tabs.Screen name="Records" options={{ title: 'Records' }} />
    </Tabs>
  );
}