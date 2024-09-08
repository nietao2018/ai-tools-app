import type { BlogNavigation } from '@/db/supabase/types';

import BlogNavCard from './blogNavCard';

export default function BlogNavCardList({ dataList }: { dataList: BlogNavigation[] }) {
  return (
    <div className='grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4'>
      {dataList?.map((item) => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <BlogNavCard key={item.id} {...item} />
      ))}
    </div>
  );
}
