# """
# Routes incoming webhooks to configured delivery targets
# Integrates with your existing delivery worker
# """

# from typing import List, Dict, Any
# from datetime import datetime
# from sqlalchemy import text
# import json

# from .database import SessionLocal


# class DeliveryTargetsRouter:
#     """
#     Routes webhooks to delivery targets based on configuration
#     """
    
#     def __init__(self):
#         self.worker = {}
#         self._load_worker()
    
#     def _load_worker(self):
#         """Lazy load delivery worker"""
#         try:
#             from services.worker.delivery.http import deliver_http
#             self.worker['http'] = deliver_http
#         except ImportError:
#             pass
        
#         try:
#             from services.worker.delivery.sqs import deliver_sqs
#             self.worker['sqs'] = deliver_sqs
#         except ImportError:
#             pass
        
#         try:
#             from services.worker.delivery.kafka import deliver_kafka
#             self.worker['kafka'] = deliver_kafka
#         except ImportError:
#             pass
        
#         try:
#             from services.worker.delivery.rabbitmq import deliver_rabbitmq
#             self.worker['rabbitmq'] = deliver_rabbitmq
#         except ImportError:
#             pass
        
#         try:
#             from services.worker.delivery.redis import deliver_redis
#             self.worker['redis'] = deliver_redis
#         except ImportError:
#             pass
        
#         try:
#             from services.worker.delivery.grpc import deliver_grpc
#             self.worker['grpc'] = deliver_grpc
#         except ImportError:
#             pass
    
#     def get_active_targets(self, user_id: str, provider: str = None) -> List[Dict[str, Any]]:
#         """
#         Get all active delivery targets for a user
#         Optionally filter by provider
#         """
#         db = SessionLocal()
#         try:
#             query = """
#                 SELECT id, type, config, providers
#                 FROM delivery_targets
#                 WHERE user_id = :user_id 
#                 AND enabled = TRUE
#             """
#             params = {"user_id": user_id}
            
#             targets = db.execute(text(query), params).fetchall()
            
#             # Filter by provider if specified
#             filtered_targets = []
#             for target in targets:
#                 target_providers = target[3] 


#                 if isinstance(target_providers, str):
#                  target_providers = json.loads(target_providers)

#                 if not target_providers:
#                  target_providers = []
                
#                 # If target has no provider filter, it accepts all providers
#                 # If target has provider filter, check if current provider matches
#                 if not target_providers or not provider or provider in target_providers:
#                     filtered_targets.append({
#                         'id': str(target[0]),
#                         'type': target[1],
#                         'config': target[2],
#                         'providers': target_providers,
#                     })
            
#             return filtered_targets
#         finally:
#             db.close()
    
#     def deliver_webhook(
#         self,
#         user_id: str,
#         webhook_data: Dict[str, Any],
#         provider: str = None
#     ) -> Dict[str, Any]:
#         """
#         Deliver webhook to all matching delivery targets
        
#         Args:
#             user_id: User who owns the targets
#             webhook_data: Webhook payload to deliver
#             provider: Provider name (e.g., 'stripe', 'github')
        
#         Returns:
#             Dictionary with delivery results
#         """
#         targets = self.get_active_targets(user_id, provider)
        
#         results = {
#             'total_targets': len(targets),
#             'successful': 0,
#             'failed': 0,
#             'details': []
#         }
        
#         if not targets:
#             return results
        
#         # Deliver to each target
#         for target in targets:
#             target_id = target['id']
#             target_type = target['type']
#             config = target['config']
            
#             try:
#                 # Get the appropriate worker
#                 worker = self.worker.get(target_type)
                
#                 if not worker:
#                     results['failed'] += 1
#                     results['details'].append({
#                         'target_id': target_id,
#                         'target_type': target_type,
#                         'success': False,
#                         'error': f'No worker found for type: {target_type}'
#                     })
#                     self._update_target_stats(target_id, success=False)
#                     continue
                
#                 # Deliver using the worker
#                 result = worker(config, webhook_data)
                
#                 results['successful'] += 1
#                 results['details'].append({
#                     'target_id': target_id,
#                     'target_type': target_type,
#                     'success': True,
#                     'result': result
#                 })
#                 self._update_target_stats(target_id, success=True)
                
#             except Exception as e:
#                 results['failed'] += 1
#                 results['details'].append({
#                     'target_id': target_id,
#                     'target_type': target_type,
#                     'success': False,
#                     'error': str(e)
#                 })
#                 self._update_target_stats(target_id, success=False)
        
#         return results
    
#     def _update_target_stats(self, target_id: str, success: bool):
#         """Update delivery statistics for a target"""
#         db = SessionLocal()
#         try:
#             if success:
#                 db.execute(
#                     text("""
#                         UPDATE delivery_targets
#                         SET success_count = success_count + 1,
#                             last_used = CURRENT_TIMESTAMP
#                         WHERE id = :id
#                     """),
#                     {"id": target_id}
#                 )
#             else:
#                 db.execute(
#                     text("""
#                         UPDATE delivery_targets
#                         SET error_count = error_count + 1,
#                             last_used = CURRENT_TIMESTAMP
#                         WHERE id = :id
#                     """),
#                     {"id": target_id}
#                 )
#             db.commit()
#         except Exception as e:
#             print(f"Error updating target stats: {e}")
#         finally:
#             db.close()


# # Global instance
# delivery_router = DeliveryTargetsRouter()


# # Helper function for easy integration


# def route_webhook_to_targets(
#     user_id: str,
#     webhook_data: Dict[str, Any],
#     provider: str = None
# ) -> Dict[str, Any]:
#     """
#     Convenience function to route webhook to delivery targets
    
#     Usage:
#         from services.worker.delivery_targets_router import route_webhook_to_targets
        
#         result = route_webhook_to_targets(
#             user_id="user-123",
#             webhook_data={"event": "payment_intent.succeeded", ...},
#             provider="stripe"
#         )
#     """
#     return delivery_router.deliver_webhook(user_id, webhook_data, provider)










"""
Routes incoming webhooks to configured delivery targets
Integrates with your existing delivery worker
"""

from typing import List, Dict, Any
from datetime import datetime
from sqlalchemy import text
import json

from .database import SessionLocal


class DeliveryTargetsRouter:
    """
    Routes webhooks to delivery targets based on configuration
    """

    def __init__(self):
        self.worker = {}
        self._load_worker()

    def _load_worker(self):
        """Lazy load delivery worker"""
        try:
            from services.worker.delivery.http import deliver_http
            self.worker['http'] = deliver_http
        except ImportError:
            pass

        try:
            from services.worker.delivery.sqs import deliver_sqs
            self.worker['sqs'] = deliver_sqs
        except ImportError:
            pass

        try:
            from services.worker.delivery.kafka import deliver_kafka
            self.worker['kafka'] = deliver_kafka
        except ImportError:
            pass

        try:
            from services.worker.delivery.rabbitmq import deliver_rabbitmq
            self.worker['rabbitmq'] = deliver_rabbitmq
        except ImportError:
            pass

        try:
            from services.worker.delivery.redis import deliver_redis
            self.worker['redis'] = deliver_redis
        except ImportError:
            pass

        try:
            from services.worker.delivery.grpc import deliver_grpc
            self.worker['grpc'] = deliver_grpc
        except ImportError:
            pass

    def get_active_targets(self, user_id: str, provider: str = None) -> List[Dict[str, Any]]:
        """
        Get all active delivery targets for a user
        Optionally filter by provider
        """
        db = SessionLocal()
        try:
            query = """
                SELECT id, type, config, providers
                FROM delivery_targets
                WHERE user_id = :user_id
                AND enabled = TRUE
            """
            params = {"user_id": user_id}

            targets = db.execute(text(query), params).fetchall()

            filtered_targets = []

            for target in targets:
                raw_config = target[2]
                raw_providers = target[3]

                #  Parse config safely
                config = raw_config
                if isinstance(config, str):
                    try:
                        config = json.loads(config)
                    except Exception:
                        config = {}

                #  Parse providers safely
                providers = raw_providers
                if isinstance(providers, str):
                    try:
                        providers = json.loads(providers)
                    except Exception:
                        providers = []

                if not providers:
                    providers = []

                #  Provider filtering logic
                if not providers or not provider or provider in providers:
                    filtered_targets.append({
                        "id": str(target[0]),
                        "type": target[1],
                        "config": config,
                        "providers": providers,
                    })

            return filtered_targets

        finally:
            db.close()

    def deliver_webhook(
        self,
        user_id: str,
        webhook_data: Dict[str, Any],
        provider: str = None
    ) -> Dict[str, Any]:
        """
        Deliver webhook to all matching delivery targets
        """
        targets = self.get_active_targets(user_id, provider)

        results = {
            "total_targets": len(targets),
            "successful": 0,
            "failed": 0,
            "details": []
        }

        if not targets:
            return results

        for target in targets:
            target_id = target["id"]
            target_type = target["type"]
            config = target["config"]

            try:
                worker = self.worker.get(target_type)

                if not worker:
                    results["failed"] += 1
                    results["details"].append({
                        "target_id": target_id,
                        "target_type": target_type,
                        "success": False,
                        "error": f"No worker found for type: {target_type}"
                    })
                    self._update_target_stats(target_id, success=False)
                    continue

                #  Deliver webhook
                result = worker(config, webhook_data)

                results["successful"] += 1
                results["details"].append({
                    "target_id": target_id,
                    "target_type": target_type,
                    "success": True,
                    "result": result
                })

                self._update_target_stats(target_id, success=True)

            except Exception as e:
                results["failed"] += 1
                results["details"].append({
                    "target_id": target_id,
                    "target_type": target_type,
                    "success": False,
                    "error": str(e)
                })

                self._update_target_stats(target_id, success=False)

        return results

    def _update_target_stats(self, target_id: str, success: bool):
        """Update delivery statistics for a target"""
        db = SessionLocal()
        try:
            if success:
                db.execute(
                    text("""
                        UPDATE delivery_targets
                        SET success_count = success_count + 1,
                            last_used = CURRENT_TIMESTAMP
                        WHERE id = :id
                    """),
                    {"id": target_id}
                )
            else:
                db.execute(
                    text("""
                        UPDATE delivery_targets
                        SET error_count = error_count + 1,
                            last_used = CURRENT_TIMESTAMP
                        WHERE id = :id
                    """),
                    {"id": target_id}
                )
            db.commit()
        except Exception as e:
            print(f"Error updating target stats: {e}")
        finally:
            db.close()


# Global instance
delivery_router = DeliveryTargetsRouter()


def route_webhook_to_targets(
    user_id: str,
    webhook_data: Dict[str, Any],
    provider: str = None
) -> Dict[str, Any]:
    """
    Convenience function to route webhook to delivery targets
    """
    return delivery_router.deliver_webhook(user_id, webhook_data, provider)