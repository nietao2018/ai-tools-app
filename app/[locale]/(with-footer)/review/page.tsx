import { createClient } from '@/db/supabase/client';

export default async function ReviewPage() {
  const supabase = createClient();
  // 获取所有提交的数据
  const { data: submissions, error } = await supabase.from('submit_data').select('*').order('id', { ascending: false });

  if (error) {
    console.error('Error fetching submissions:', error);
    return <div>加载数据时出错</div>;
  }

  return (
    <div className='container mx-auto px-4 py-8 sm:px-6 lg:px-8'>
      <h1 className='mb-8 text-3xl font-bold text-gray-900'>数据审核列表</h1>
      <div className='grid gap-8'>
        {submissions?.map((item) => (
          <div
            key={item.id}
            className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md'
          >
            <div className='flex items-start gap-6'>
              {item.thumbnail_url && (
                <img
                  src={item.thumbnail_url}
                  alt={item.title}
                  className='h-32 w-32 rounded-lg object-cover shadow-sm'
                />
              )}
              <div className='min-w-0 flex-1'>
                <h2 className='mb-2 line-clamp-1 text-xl font-semibold text-gray-900'>{item.title}</h2>
                <p className='mb-3 line-clamp-2 text-gray-600'>{item.content}</p>
                <div className='mb-3 flex flex-wrap gap-2'>
                  <span className='rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700'>
                    {item.category_name}
                  </span>
                  <span className='rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700'>
                    {item.tag_name}
                  </span>
                </div>
                <div className='mb-3 flex items-center text-sm text-gray-500'>
                  <span className='flex items-center'>
                    <svg className='mr-1 h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                    {item.star_rating}
                  </span>
                  <span className='mx-3'>•</span>
                  <span>{new Date(item.collection_time).toLocaleDateString()}</span>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                      item.is_reviewed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {item.is_reviewed ? '已审核' : '待审核'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
