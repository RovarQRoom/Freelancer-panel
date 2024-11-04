export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	public: {
		Tables: {
			Language: {
				Row: {
					ar: string | null;
					ckb: string | null;
					created_at: string;
					deleted_at: string | null;
					en: string;
					id: number;
				};
				Insert: {
					ar?: string | null;
					ckb?: string | null;
					created_at?: string;
					deleted_at?: string | null;
					en: string;
					id?: number;
				};
				Update: {
					ar?: string | null;
					ckb?: string | null;
					created_at?: string;
					deleted_at?: string | null;
					en?: string;
					id?: number;
				};
				Relationships: [];
			};
			Policy: {
				Row: {
					created_at: string;
					id: number;
					name: string;
				};
				Insert: {
					created_at?: string;
					id?: number;
					name: string;
				};
				Update: {
					created_at?: string;
					id?: number;
					name?: string;
				};
				Relationships: [];
			};
			Role: {
				Row: {
					created_at: string;
					id: number;
					name: string;
				};
				Insert: {
					created_at?: string;
					id?: number;
					name: string;
				};
				Update: {
					created_at?: string;
					id?: number;
					name?: string;
				};
				Relationships: [];
			};
			RolePolicy: {
				Row: {
					created_at: string;
					id: number;
					policy: number | null;
					role: number | null;
				};
				Insert: {
					created_at?: string;
					id?: number;
					policy?: number | null;
					role?: number | null;
				};
				Update: {
					created_at?: string;
					id?: number;
					policy?: number | null;
					role?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'RolePolicy_policy_fkey';
						columns: ['policy'];
						isOneToOne: false;
						referencedRelation: 'Policy';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'RolePolicy_role_fkey';
						columns: ['role'];
						isOneToOne: false;
						referencedRelation: 'Role';
						referencedColumns: ['id'];
					}
				];
			};
			Service: {
				Row: {
					created_at: string;
					created_by: number | null;
					deleted_at: string | null;
					demo: string | null;
					description: string | null;
					id: number;
					media: string | null;
					price: number;
					supervised_by: number | null;
					title: string;
				};
				Insert: {
					created_at?: string;
					created_by?: number | null;
					deleted_at?: string | null;
					demo?: string | null;
					description?: string | null;
					id?: number;
					media?: string | null;
					price?: number;
					supervised_by?: number | null;
					title: string;
				};
				Update: {
					created_at?: string;
					created_by?: number | null;
					deleted_at?: string | null;
					demo?: string | null;
					description?: string | null;
					id?: number;
					media?: string | null;
					price?: number;
					supervised_by?: number | null;
					title?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'Service_created_by_fkey';
						columns: ['created_by'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Service_supervised_by_fkey';
						columns: ['supervised_by'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					}
				];
			};
			User: {
				Row: {
					auth: string | null;
					created_at: string;
					deleted_at: string | null;
					email: string;
					id: number;
					image: string | null;
					name: string | null;
					phone: string;
					role: number | null;
				};
				Insert: {
					auth?: string | null;
					created_at?: string;
					deleted_at?: string | null;
					email: string;
					id?: number;
					image?: string | null;
					name?: string | null;
					phone: string;
					role?: number | null;
				};
				Update: {
					auth?: string | null;
					created_at?: string;
					deleted_at?: string | null;
					email?: string;
					id?: number;
					image?: string | null;
					name?: string | null;
					phone?: string;
					role?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'User_role_fkey';
						columns: ['role'];
						isOneToOne: false;
						referencedRelation: 'Role';
						referencedColumns: ['id'];
					}
				];
			};
			UserService: {
				Row: {
					created_at: string;
					deleted_at: string | null;
					id: number;
					service: number;
					user: number;
				};
				Insert: {
					created_at?: string;
					deleted_at?: string | null;
					id?: number;
					service: number;
					user: number;
				};
				Update: {
					created_at?: string;
					deleted_at?: string | null;
					id?: number;
					service?: number;
					user?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'UserService_service_fkey';
						columns: ['service'];
						isOneToOne: false;
						referencedRelation: 'Service';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'UserService_user_fkey';
						columns: ['user'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema['Tables'] & PublicSchema['Views'])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
				Database[PublicTableNameOrOptions['schema']]['Views'])
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
			Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
		? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
		? PublicSchema['Enums'][PublicEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof PublicSchema['CompositeTypes']
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
		? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
		: never;

// Schema: public
// Tables
export type Language = Database['public']['Tables']['Language']['Row'];
export type InsertLanguage = Database['public']['Tables']['Language']['Insert'];
export type UpdateLanguage = Database['public']['Tables']['Language']['Update'];

export type Policy = Database['public']['Tables']['Policy']['Row'];
export type InsertPolicy = Database['public']['Tables']['Policy']['Insert'];
export type UpdatePolicy = Database['public']['Tables']['Policy']['Update'];

export type Role = Database['public']['Tables']['Role']['Row'];
export type InsertRole = Database['public']['Tables']['Role']['Insert'];
export type UpdateRole = Database['public']['Tables']['Role']['Update'];

export type RolePolicy = Database['public']['Tables']['RolePolicy']['Row'];
export type InsertRolePolicy = Database['public']['Tables']['RolePolicy']['Insert'];
export type UpdateRolePolicy = Database['public']['Tables']['RolePolicy']['Update'];

export type Service = Database['public']['Tables']['Service']['Row'];
export type InsertService = Database['public']['Tables']['Service']['Insert'];
export type UpdateService = Database['public']['Tables']['Service']['Update'];

export type User = Database['public']['Tables']['User']['Row'];
export type InsertUser = Database['public']['Tables']['User']['Insert'];
export type UpdateUser = Database['public']['Tables']['User']['Update'];

export type UserService = Database['public']['Tables']['UserService']['Row'];
export type InsertUserService = Database['public']['Tables']['UserService']['Insert'];
export type UpdateUserService = Database['public']['Tables']['UserService']['Update'];
