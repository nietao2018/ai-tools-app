import { createClient } from '@/db/supabase/client';
import { v4 as uuidv4 } from 'uuid';

import { getCurrentDate } from '@/lib/utils/timeUtils';

// 数据库表名
const tableName = 'user_info';

interface UserData {
  user_id: any;
  created_at: string;
  updated_at: string;
  name: String;
  email: String;
  image: String;
  last_login_ip: String;
}

async function queryUserByEmail(email: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from(tableName).select().eq('email', email);
  if (error) {
    throw new Error('数据库ByEmail查询错误');
  } else {
    return data;
  }
}

async function queryUserById(user_id: any) {
  const supabase = createClient();
  const { data, error } = await supabase.from(tableName).select().eq('user_id', user_id);
  if (error) {
    throw new Error('数据库ById查询错误');
  } else {
    return data;
  }
}

async function insertUserByEmail(userData: UserData) {
  const supabase = createClient();
  // @ts-ignore
  const { data, error } = await supabase.from(tableName).insert(userData); // 插入数据

  if (error) {
    throw new Error('数据库插入ByEmail错误');
  } else {
    return data;
  }
}

async function updateUserById(userId: any, userData: UserData) {
  const supabase = createClient();
  // @ts-ignore
  const { data, error } = await supabase.from(tableName).update(userData).eq('user_id', userId); // 指定更新条件，通常是主键

  if (error) {
    throw new Error('数据库更新ById错误');
  } else {
    return data;
  }
}

export const checkAndSaveUser = async (name: string, email: string, image: string, last_login_ip: string) => {
  try {
    console.error('checkAndSaveUser');
    const users = await queryUserByEmail(email);
    if (users.length <= 0) {
      const result = {
        user_id: uuidv4(),
        created_at: getCurrentDate(),
        updated_at: getCurrentDate(),
        name,
        email,
        image,
        last_login_ip,
      };

      // 新增
      await insertUserByEmail({
        ...result,
      });
      return result;
    }
    // 更新
    const user = users[0];
    const updateData = {
      user_id: user.id,
      created_at: user.created_at,
      updated_at: getCurrentDate(),
      name,
      email,
      image,
      last_login_ip,
    };
    await updateUserById(user.user_id, {
      ...updateData,
    });
    return updateData;
  } catch (e) {
    console.error('checkAndSaveUser', e);
    return {
      user_id: '',
      name: '',
      email,
      image: '',
      status: 0,
    };
  }
};

export const getUserById = async (user_id: any) => {
  try {
    const users = await queryUserById(user_id);
    if (users.length > 0) {
      const user = users[0];
      return {
        ...user,
        status: 1,
      };
    }
    return {
      user_id,
      name: '',
      email: '',
      image: '',
      status: 0,
    };
  } catch (e) {
    console.error('getUserById', e);
    return {
      user_id: '',
      name: '',
      email: '',
      image: '',
      status: 0,
    };
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const users = await queryUserByEmail(email);
    if (users.length > 0) {
      const user = users[0];
      return {
        ...user,
        status: 1,
      };
    }
    return {
      user_id: '',
      name: '',
      email,
      image: '',
      status: 0,
    };
  } catch (e) {
    console.error('getUserByEmail', e);
    return {
      user_id: '',
      name: '',
      email,
      image: '',
      status: 0,
    };
  }
};
