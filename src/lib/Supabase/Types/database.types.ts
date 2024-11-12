export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	public: {
		Tables: {
			Category: {
				Row: {
					created_at: string;
					deleted_at: string | null;
					icon: string | null;
					id: number;
					image: string;
					title: number;
				};
				Insert: {
					created_at?: string;
					deleted_at?: string | null;
					icon?: string | null;
					id?: number;
					image: string;
					title: number;
				};
				Update: {
					created_at?: string;
					deleted_at?: string | null;
					icon?: string | null;
					id?: number;
					image?: string;
					title?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'Category_title_fkey';
						columns: ['title'];
						isOneToOne: false;
						referencedRelation: 'Language';
						referencedColumns: ['id'];
					}
				];
			};
			Conversation: {
				Row: {
					created_at: string;
					deleted_at: string | null;
					id: number;
					is_group: boolean | null;
					name: string | null;
				};
				Insert: {
					created_at?: string;
					deleted_at?: string | null;
					id?: number;
					is_group?: boolean | null;
					name?: string | null;
				};
				Update: {
					created_at?: string;
					deleted_at?: string | null;
					id?: number;
					is_group?: boolean | null;
					name?: string | null;
				};
				Relationships: [];
			};
			ConversationParticipant: {
				Row: {
					conversation: number | null;
					created_at: string;
					deleted_at: string | null;
					id: number;
					user: number | null;
				};
				Insert: {
					conversation?: number | null;
					created_at?: string;
					deleted_at?: string | null;
					id?: number;
					user?: number | null;
				};
				Update: {
					conversation?: number | null;
					created_at?: string;
					deleted_at?: string | null;
					id?: number;
					user?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'ConversationParticipant_conversation_fkey';
						columns: ['conversation'];
						isOneToOne: false;
						referencedRelation: 'Conversation';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'ConversationParticipant_user_fkey';
						columns: ['user'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					}
				];
			};
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
			Message: {
				Row: {
					content: string;
					conversation: number | null;
					created_at: string;
					deleted_at: string | null;
					id: number;
					is_read: boolean | null;
					sender: number | null;
				};
				Insert: {
					content: string;
					conversation?: number | null;
					created_at?: string;
					deleted_at?: string | null;
					id?: number;
					is_read?: boolean | null;
					sender?: number | null;
				};
				Update: {
					content?: string;
					conversation?: number | null;
					created_at?: string;
					deleted_at?: string | null;
					id?: number;
					is_read?: boolean | null;
					sender?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'Message_conversation_fkey';
						columns: ['conversation'];
						isOneToOne: false;
						referencedRelation: 'Conversation';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Message_sender_fkey';
						columns: ['sender'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					}
				];
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
			Rating: {
				Row: {
					created_at: string;
					deleted_at: string | null;
					id: number;
					rate: number;
					review: string | null;
					service: number;
					user: number;
				};
				Insert: {
					created_at?: string;
					deleted_at?: string | null;
					id?: number;
					rate?: number;
					review?: string | null;
					service: number;
					user: number;
				};
				Update: {
					created_at?: string;
					deleted_at?: string | null;
					id?: number;
					rate?: number;
					review?: string | null;
					service?: number;
					user?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'Rating_service_fkey';
						columns: ['service'];
						isOneToOne: false;
						referencedRelation: 'Service';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Rating_user_fkey';
						columns: ['user'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					}
				];
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
						foreignKeyName: 'rolepolicy_policy_fkey';
						columns: ['policy'];
						isOneToOne: false;
						referencedRelation: 'Policy';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'rolepolicy_role_fkey';
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
					description: number | null;
					id: number;
					media: number | null;
					price: number;
					supervised_by: number | null;
					supports: string[] | null;
					tags: string[] | null;
					title: number;
				};
				Insert: {
					created_at?: string;
					created_by?: number | null;
					deleted_at?: string | null;
					demo?: string | null;
					description?: number | null;
					id?: number;
					media?: number | null;
					price?: number;
					supervised_by?: number | null;
					supports?: string[] | null;
					tags?: string[] | null;
					title: number;
				};
				Update: {
					created_at?: string;
					created_by?: number | null;
					deleted_at?: string | null;
					demo?: string | null;
					description?: number | null;
					id?: number;
					media?: number | null;
					price?: number;
					supervised_by?: number | null;
					supports?: string[] | null;
					tags?: string[] | null;
					title?: number;
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
						foreignKeyName: 'Service_description_fkey';
						columns: ['description'];
						isOneToOne: false;
						referencedRelation: 'Language';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Service_media_fkey';
						columns: ['media'];
						isOneToOne: false;
						referencedRelation: 'Language';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Service_supervised_by_fkey';
						columns: ['supervised_by'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Service_title_fkey';
						columns: ['title'];
						isOneToOne: false;
						referencedRelation: 'Language';
						referencedColumns: ['id'];
					}
				];
			};
			Subcategory: {
				Row: {
					category: number | null;
					created_at: string;
					deleted_at: string | null;
					description: number | null;
					id: number;
					title: number;
				};
				Insert: {
					category?: number | null;
					created_at?: string;
					deleted_at?: string | null;
					description?: number | null;
					id?: number;
					title: number;
				};
				Update: {
					category?: number | null;
					created_at?: string;
					deleted_at?: string | null;
					description?: number | null;
					id?: number;
					title?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'Subcategory_category_fkey';
						columns: ['category'];
						isOneToOne: false;
						referencedRelation: 'Category';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Subcategory_description_fkey';
						columns: ['description'];
						isOneToOne: false;
						referencedRelation: 'Language';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Subcategory_title_fkey';
						columns: ['title'];
						isOneToOne: false;
						referencedRelation: 'Language';
						referencedColumns: ['id'];
					}
				];
			};
			TypingStatus: {
				Row: {
					conservation: number | null;
					created_at: string;
					id: number;
					is_typing: boolean | null;
					updated_at: string | null;
					user: number | null;
				};
				Insert: {
					conservation?: number | null;
					created_at?: string;
					id?: number;
					is_typing?: boolean | null;
					updated_at?: string | null;
					user?: number | null;
				};
				Update: {
					conservation?: number | null;
					created_at?: string;
					id?: number;
					is_typing?: boolean | null;
					updated_at?: string | null;
					user?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'TypingStatus_conservation_fkey';
						columns: ['conservation'];
						isOneToOne: false;
						referencedRelation: 'Conversation';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'TypingStatus_user_fkey';
						columns: ['user'];
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
			'Languages ': 'EN' | 'AR' | 'CKB';
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
// Enums
export enum Languages {
	EN = 'EN',
	AR = 'AR',
	CKB = 'CKB'
}

// Tables
export type Category = Database['public']['Tables']['Category']['Row'];
export type InsertCategory = Database['public']['Tables']['Category']['Insert'];
export type UpdateCategory = Database['public']['Tables']['Category']['Update'];

export type Conversation = Database['public']['Tables']['Conversation']['Row'];
export type InsertConversation = Database['public']['Tables']['Conversation']['Insert'];
export type UpdateConversation = Database['public']['Tables']['Conversation']['Update'];

export type ConversationParticipant =
	Database['public']['Tables']['ConversationParticipant']['Row'];
export type InsertConversationParticipant =
	Database['public']['Tables']['ConversationParticipant']['Insert'];
export type UpdateConversationParticipant =
	Database['public']['Tables']['ConversationParticipant']['Update'];

export type Language = Database['public']['Tables']['Language']['Row'];
export type InsertLanguage = Database['public']['Tables']['Language']['Insert'];
export type UpdateLanguage = Database['public']['Tables']['Language']['Update'];

export type Message = Database['public']['Tables']['Message']['Row'];
export type InsertMessage = Database['public']['Tables']['Message']['Insert'];
export type UpdateMessage = Database['public']['Tables']['Message']['Update'];

export type Policy = Database['public']['Tables']['Policy']['Row'];
export type InsertPolicy = Database['public']['Tables']['Policy']['Insert'];
export type UpdatePolicy = Database['public']['Tables']['Policy']['Update'];

export type Rating = Database['public']['Tables']['Rating']['Row'];
export type InsertRating = Database['public']['Tables']['Rating']['Insert'];
export type UpdateRating = Database['public']['Tables']['Rating']['Update'];

export type Role = Database['public']['Tables']['Role']['Row'];
export type InsertRole = Database['public']['Tables']['Role']['Insert'];
export type UpdateRole = Database['public']['Tables']['Role']['Update'];

export type RolePolicy = Database['public']['Tables']['RolePolicy']['Row'];
export type InsertRolePolicy = Database['public']['Tables']['RolePolicy']['Insert'];
export type UpdateRolePolicy = Database['public']['Tables']['RolePolicy']['Update'];

export type Service = Database['public']['Tables']['Service']['Row'];
export type InsertService = Database['public']['Tables']['Service']['Insert'];
export type UpdateService = Database['public']['Tables']['Service']['Update'];

export type Subcategory = Database['public']['Tables']['Subcategory']['Row'];
export type InsertSubcategory = Database['public']['Tables']['Subcategory']['Insert'];
export type UpdateSubcategory = Database['public']['Tables']['Subcategory']['Update'];

export type TypingStatus = Database['public']['Tables']['TypingStatus']['Row'];
export type InsertTypingStatus = Database['public']['Tables']['TypingStatus']['Insert'];
export type UpdateTypingStatus = Database['public']['Tables']['TypingStatus']['Update'];

export type User = Database['public']['Tables']['User']['Row'];
export type InsertUser = Database['public']['Tables']['User']['Insert'];
export type UpdateUser = Database['public']['Tables']['User']['Update'];

export type UserService = Database['public']['Tables']['UserService']['Row'];
export type InsertUserService = Database['public']['Tables']['UserService']['Insert'];
export type UpdateUserService = Database['public']['Tables']['UserService']['Update'];
