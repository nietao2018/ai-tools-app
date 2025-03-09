'use client';

/* eslint-disable react/jsx-props-no-spreading */
import { useState } from 'react';
import { createClient } from '@/db/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { WEBSITE_EXAMPLE } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Spinning from '@/components/Spinning';

const FormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  detail: z.string().min(1, 'Detail is required'),
  url: z.string().url('Please enter a valid URL'),
  image_url: z.string().url('Please enter a valid image URL'),
  thumbnail_url: z.string().url('Please enter a valid thumbnail URL'),
  website_data: z.string().min(1, 'Website data is required'),
  tag_name: z.string().min(1, 'Tag is required'),
  category_name: z.string().min(1, 'Category is required'),
});

// 添加新的类型定义
type UploadingState = {
  image: boolean;
  thumbnail: boolean;
};

export default function SubmitForm({ className }: { className?: string }) {
  const supabase = createClient();
  const t = useTranslations('Submit');

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<UploadingState>({
    image: false,
    thumbnail: false,
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      content: '',
      detail: '',
      url: '',
      image_url: '',
      thumbnail_url: '',
      website_data: '',
      tag_name: '',
      category_name: '',
    },
  });

  // 修改处理图片上传的函数
  const handleImageUpload = async (file: File, type: 'image' | 'thumbnail') => {
    try {
      setUploading((prev) => ({ ...prev, [type]: true }));
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { url } = await response.json();

      // 更新表单数据
      form.setValue(type === 'image' ? 'image_url' : 'thumbnail_url', url);
      toast.success(t('uploadSuccess'));
    } catch (error) {
      toast.error(t('uploadError'));
      // eslint-disable-next-line no-console
      console.error('Upload error:', error);
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    let errMsg: any = t('networkError');
    try {
      setLoading(true);
      const { error } = await supabase.from('submit_data').insert({
        title: formData.title,
        content: formData.content,
        detail: formData.detail,
        url: formData.url,
        image_url: formData.image_url,
        thumbnail_url: formData.thumbnail_url,
        name: formData.website_data,
        tag_name: formData.tag_name,
        category_name: formData.category_name,
        collection_time: new Date().toISOString(),
        is_reviewed: false,
      });
      if (error) {
        errMsg = error.message;
        throw new Error();
      }
      toast.success(t('success'));
      form.reset();
    } catch (error) {
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          'mx-3 mb-5 flex flex-col gap-4 rounded-[12px] bg-[#2C2D36] px-3 py-5 lg:w-[800px] lg:p-8',
          className,
        )}
      >
        <div className='grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-5'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem className='space-y-1'>
                <FormLabel className='text-white/90'>{t('title')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter title'
                    className='input-border-pink h-[42px] w-full rounded-[8px] border-[0.5px] bg-dark-bg p-5'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='url'
            render={({ field }) => (
              <FormItem className='space-y-1'>
                <FormLabel className='text-white/90'>{t('url')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter URL'
                    className='input-border-pink h-[42px] w-full rounded-[8px] border-[0.5px] bg-dark-bg p-5'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='content'
            render={({ field }) => (
              <FormItem className='space-y-1'>
                <FormLabel className='text-white/90'>{t('content')}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Short description'
                    className='input-border-pink min-h-[120px] w-full resize-none rounded-[8px] border-[0.5px] bg-dark-bg p-5'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='detail'
            render={({ field }) => (
              <FormItem className='space-y-1'>
                <FormLabel className='text-white/90'>{t('detail')}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Detail description'
                    className='input-border-pink min-h-[120px] w-full resize-none rounded-[8px] border-[0.5px] bg-dark-bg p-5'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='image_url'
            render={({ field }) => (
              <FormItem className='space-y-1'>
                <FormLabel className='text-white/90'>{t('image_url')}</FormLabel>
                <FormControl>
                  <div className='flex gap-2'>
                    <Input
                      placeholder='Enter image URL'
                      className='input-border-pink h-[42px] w-full rounded-[8px] border-[0.5px] bg-dark-bg/50 p-5'
                      readOnly
                      {...field}
                    />
                    <Input
                      type='file'
                      accept='image/*'
                      className='hidden'
                      id='image-upload'
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'image');
                      }}
                    />
                    <label
                      htmlFor='image-upload'
                      className='flex-center h-[42px] w-[100px] rounded-[8px] bg-white text-black hover:cursor-pointer hover:opacity-80'
                    >
                      {uploading.image ? <Spinning className='size-[22px] text-black' /> : 'upload'}
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='thumbnail_url'
            render={({ field }) => (
              <FormItem className='space-y-1'>
                <FormLabel className='text-white/90'>{t('thumbnail_url')}</FormLabel>
                <FormControl>
                  <div className='flex gap-2'>
                    <Input
                      placeholder='Enter thumbnail URL'
                      className='input-border-pink h-[42px] w-full rounded-[8px] border-[0.5px] bg-dark-bg/50 p-5'
                      readOnly
                      {...field}
                    />
                    <Input
                      type='file'
                      accept='image/*'
                      className='hidden'
                      id='thumbnail-upload'
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'thumbnail');
                      }}
                    />
                    <label
                      htmlFor='thumbnail-upload'
                      className='flex-center h-[42px] w-[100px] rounded-[8px] bg-white text-black hover:cursor-pointer hover:opacity-80'
                    >
                      {uploading.thumbnail ? <Spinning className='size-[22px] text-black' /> : 'upload'}
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='website_data'
            render={({ field }) => (
              <FormItem className='space-y-1'>
                <FormLabel className='text-white/90'>{t('website_data')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter website data'
                    className='input-border-pink h-[42px] w-full rounded-[8px] border-[0.5px] bg-dark-bg p-5'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='tag_name'
            render={({ field }) => (
              <FormItem className='space-y-1'>
                <FormLabel className='text-white/90'>{t('tag_name')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter tag name'
                    className='input-border-pink h-[42px] w-full rounded-[8px] border-[0.5px] bg-dark-bg p-5'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='category_name'
            render={({ field }) => (
              <FormItem className='space-y-1'>
                <FormLabel className='text-white/90'>{t('category_name')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter category name'
                    className='input-border-pink h-[42px] w-full rounded-[8px] border-[0.5px] bg-dark-bg p-5'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex flex-col gap-[10px] lg:gap-8'>
          <button
            type='submit'
            disabled={loading}
            className={cn(
              'flex-center mt-auto h-[48px] w-full gap-4 rounded-[8px] bg-white font-bold text-black hover:cursor-pointer hover:opacity-80 disabled:opacity-50',
              loading && 'hover:cursor-not-allowed',
            )}
          >
            {loading ? <Spinning className='size-[22px] text-black' /> : t('submit')}
          </button>
          <p className='text-[13px] text-white/40'>
            {t('add')} <span className='text-white'>{WEBSITE_EXAMPLE}</span> {t('text')}
          </p>
        </div>
      </form>
    </Form>
  );
}
